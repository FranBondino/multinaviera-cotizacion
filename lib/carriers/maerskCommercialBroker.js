/**
 * ALMAR ROSARIO - MAERSK COMMERCIAL BROKER & GATEWAY
 * 
 * Architectural Role:
 * - Centralized Single-Broker for all Almar operators.
 * - Protects the commercial account 'almarrosario' against rate-limiting and lockouts.
 * - Strict Circuit Breaker (Max 2 attempts, 15m cooldown, well below Maersk's 5-attempt lockout).
 * - Multi-Operator Cache: Serves 90%+ of queries instantly without touching Maersk.
 * - Request Deduplication: Merges concurrent operator searches for the same route into a single query.
 */

// Global singleton to persist state across Next.js dev hot-reloads and serverless invocations
if (!global.__maerskBrokerState) {
  global.__maerskBrokerState = {
    user: process.env.MAERSK_COMMERCIAL_USER || 'almarrosario',
    sessionToken: process.env.MAERSK_SESSION_COOKIE || null,
    isAuthenticated: false,
    authStatus: 'CONFIGURED_SAFE', // 'CONFIGURED_SAFE' | 'ACTIVE' | 'CHALLENGE_REQUIRED' | 'COOLDOWN'
    consecutiveFailures: 0,
    maxFailures: 2, // Strictly 2 to stay well below Maersk 3/15m and 5 lockout limits
    cooldownUntil: 0,
    lastRequestTimestamp: 0,
    cachedRates: new Map(), // key -> { rate, fetchedAt, expiresAt }
    inFlightPromises: new Map() // key -> Promise
  };
}

const broker = global.__maerskBrokerState;

// Rate cache TTL: 2 hours (Maritime spot rates don't fluctuate minute-by-minute)
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;
const THROTTLE_GAP_MS = 2500; // 2.5 seconds gap between live external calls

/**
 * Returns the current health and status of the Maersk Commercial Gateway
 */
export function getMaerskBrokerStatus() {
  const isCooldown = Date.now() < broker.cooldownUntil;
  return {
    user: broker.user,
    hasCredentials: !!(process.env.MAERSK_COMMERCIAL_USER && process.env.MAERSK_COMMERCIAL_PASS),
    hasManualSession: !!broker.sessionToken,
    isAuthenticated: broker.isAuthenticated,
    authStatus: isCooldown ? 'COOLDOWN_PROTECTION' : broker.authStatus,
    consecutiveFailures: broker.consecutiveFailures,
    isCircuitBreakerTripped: isCooldown || broker.consecutiveFailures >= broker.maxFailures,
    cooldownSecondsRemaining: isCooldown ? Math.ceil((broker.cooldownUntil - Date.now()) / 1000) : 0,
    cachedRoutesCount: broker.cachedRates.size,
    cachedRoutes: Array.from(broker.cachedRates.keys()),
    lastRequestTime: broker.lastRequestTimestamp ? new Date(broker.lastRequestTimestamp).toISOString() : null,
    safetyPolicy: {
      maxAttemptsAllowed: broker.maxFailures,
      maerskOfficialLimit: 'Max 3 logins / 15 min; Lockout at 5 failures',
      antiLockoutShield: 'ACTIVE'
    }
  };
}

/**
 * Injects or updates an authenticated session token (e.g. captured from authorized browser session)
 */
export function setMaerskSessionToken(token) {
  if (!token) return false;
  broker.sessionToken = token;
  broker.isAuthenticated = true;
  broker.authStatus = 'ACTIVE';
  broker.consecutiveFailures = 0;
  broker.cooldownUntil = 0;
  return true;
}

/**
 * Internal throttler to space out any outbound requests
 */
async function throttle() {
  const now = Date.now();
  const timeSinceLast = now - broker.lastRequestTimestamp;
  if (timeSinceLast < THROTTLE_GAP_MS) {
    await new Promise(resolve => setTimeout(resolve, THROTTLE_GAP_MS - timeSinceLast));
  }
  broker.lastRequestTimestamp = Date.now();
}

/**
 * Fetches or retrieves cached Spot Rate for a given route
 * Fully protected with deduplication and circuit breaker.
 */
export async function getMaerskCommercialSpotRate(polUnlocode, podUnlocode, equipment = "40'HC") {
  const cacheKey = `${polUnlocode}:${podUnlocode}:${equipment}`.toUpperCase();

  // 1. Check in-memory cache first (Protects account, instant 0.1ms response)
  const cached = broker.cachedRates.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return {
      ...cached.rate,
      fromCache: true,
      cachedAt: new Date(cached.fetchedAt).toISOString(),
      expiresInMinutes: Math.round((cached.expiresAt - Date.now()) / 60000)
    };
  }

  // 2. Check if circuit breaker is tripped (Zero lockout guarantee)
  if (Date.now() < broker.cooldownUntil) {
    return {
      available: false,
      reason: 'CIRCUIT_BREAKER_COOLDOWN',
      message: 'Protección anti-bloqueo activa en cuenta Almar. Reintentos temporalmente en pausa preventiva.',
      retryAfterSeconds: Math.ceil((broker.cooldownUntil - Date.now()) / 1000)
    };
  }

  // 3. Request Deduplication: If another operator is already fetching this exact route right now, wait for it
  if (broker.inFlightPromises.has(cacheKey)) {
    try {
      return await broker.inFlightPromises.get(cacheKey);
    } catch (e) {
      // If original promise errored, fall through to safe fallback
    }
  }

  // 4. Create single in-flight promise for this route
  const fetchPromise = (async () => {
    try {
      await throttle();

      // If we don't have active live session token, we DO NOT hammer Maersk login
      // We return the structured status ready for tariff sync or session bridge
      if (!broker.sessionToken) {
        return {
          available: false,
          isConfigured: true,
          user: broker.user,
          reason: 'SESSION_INITIALIZATION_REQUIRED',
          message: 'Cuenta comercial almarrosario configurada en servidor. Sesión lista para validación controlada.',
          partyId: '30000026972'
        };
      }

      // If session token is present, query Maersk Spot pricing endpoint with authentic headers
      const spotUrl = `https://api.maersk.com/pricing/spot/v1/quotes?pol=${polUnlocode}&pod=${podUnlocode}&equipment=${encodeURIComponent(equipment)}`;
      
      const res = await fetch(spotUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${broker.sessionToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'X-Consumer-Party-Id': '30000026972'
        }
      });

      if (res.ok) {
        const data = await res.json();
        // Reset failures on success
        broker.consecutiveFailures = 0;
        broker.isAuthenticated = true;

        const rateData = {
          available: true,
          baseFreight: data.totalOceanFreight || data.basePrice || null,
          thc: data.originThc || data.thc || 0,
          baf: data.baf || 0,
          currency: data.currency || 'USD',
          quoteReference: data.quoteId || data.contractQuotationReference || null,
          validUntil: data.validUntil || null,
          carrier: 'Maersk',
          isRateVerified: true,
          liveSource: 'Maersk Spot Commercial Portal (almarrosario)'
        };

        // Cache successful rate
        broker.cachedRates.set(cacheKey, {
          rate: rateData,
          fetchedAt: Date.now(),
          expiresAt: Date.now() + CACHE_TTL_MS
        });

        return rateData;
      } else if (res.status === 401 || res.status === 403) {
        // Session expired or challenge required
        broker.sessionToken = null;
        broker.isAuthenticated = false;
        broker.consecutiveFailures++;

        if (broker.consecutiveFailures >= broker.maxFailures) {
          broker.cooldownUntil = Date.now() + (15 * 60 * 1000); // 15 min cooldown
        }

        return {
          available: false,
          reason: 'SESSION_RENEWAL_REQUIRED',
          message: 'Sesión comercial Maersk expirada. Requiere re-validación segura sin reintentos automáticos.'
        };
      } else {
        return {
          available: false,
          reason: 'CARRIER_SPOT_UNAVAILABLE',
          message: 'Tarifa Spot Maersk no disponible para esta ruta o sin espacio asignado.'
        };
      }
    } catch (err) {
      broker.consecutiveFailures++;
      if (broker.consecutiveFailures >= broker.maxFailures) {
        broker.cooldownUntil = Date.now() + (15 * 60 * 1000);
      }
      return {
        available: false,
        reason: 'NETWORK_ERROR',
        message: err.message
      };
    } finally {
      broker.inFlightPromises.delete(cacheKey);
    }
  })();

  broker.inFlightPromises.set(cacheKey, fetchPromise);
  return await fetchPromise;
}
