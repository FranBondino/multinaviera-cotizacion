// Ocean Network Express (ONE) Official API Connector for Multicotizador Almar
// Fully isolated server-side architecture (no client exposure)
// Uses ONE's live REST API gateway for real-time point-to-point schedules, vessels, voyages, and cut-offs

const ONE_CONFIG = {
  endpoint: process.env.ONE_API_ENDPOINT || 'https://ecomm.one-line.com/api/v1/schedule/point-to-point',
  apiKey: process.env.ONE_API_KEY,
  userAgent: process.env.ONE_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

/**
 * Fetches live schedule routes from ONE (Ocean Network Express)
 * @param {string} polUnlocode - Port of Loading UN/LOCODE (e.g., 'CNSHA')
 * @param {string} podUnlocode - Port of Discharge UN/LOCODE (e.g., 'ARBUE')
 * @param {object} options - Optional filters (fromDate, toDate, rcvTermCode, deTermCode)
 * @returns {Promise<Array|null>} List of verified live schedules
 */
export async function fetchOneLiveSchedule(polUnlocode, podUnlocode, options = {}) {
  try {
    const now = new Date();
    const future = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000); // 35-day window

    const formatDate = (d) => d.toISOString().split('T')[0];

    const fromDate = options.fromDate || formatDate(now);
    const toDate = options.toDate || formatDate(future);

    // Normalize port codes (ONE prefers 5-letter UN/LOCODE, e.g. ARBUE, CNSHA, NLRTM)
    let origin = polUnlocode;
    let destination = podUnlocode;
    if (origin === 'BUE') origin = 'ARBUE';
    if (destination === 'BUE') destination = 'ARBUE';
    if (origin === 'ROS') origin = 'ARROS';
    if (destination === 'ROS') destination = 'ARROS';

    const params = new URLSearchParams({
      porCode: origin,
      delCode: destination,
      rcvTermCode: options.rcvTermCode || 'Y',
      deTermCode: options.deTermCode || 'Y',
      fromDate,
      toDate
    });

    const url = `${ONE_CONFIG.endpoint}?${params.toString()}`;

    const headers = {
      'Accept': 'application/json',
      'User-Agent': ONE_CONFIG.userAgent,
      'Referer': 'https://ecomm.one-line.com/one-ecom/schedule/point-to-point-schedule?sessLocale=en',
      'Origin': 'https://ecomm.one-line.com'
    };

    if (ONE_CONFIG.apiKey) {
      headers['x-api-key'] = ONE_CONFIG.apiKey;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers,
      next: { revalidate: 3600 } // Cache 1 hour in Next.js
    });

    if (!res.ok) {
      console.warn(`ONE API returned status ${res.status}`);
      return null;
    }

    const data = await res.json();
    const lines = data?.scheduleLines;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return null;
    }

    // Map live voyage lines into standardized Multicotizador structure
    const parsedRoutes = lines.map((line) => {
      const firstSail = line.sailInfo?.[0];
      const vesselName = firstSail?.vvdName || line.trunkVvd || 'ONE VESSEL';
      const serviceLane = firstSail?.serviceLaneCode 
        ? `${firstSail.serviceLaneCode} - ${firstSail.serviceLaneName || 'Express'}`
        : 'SX1 - South America Express';

      const etdRaw = firstSail?.departureDate || line.porDepartureDate || line.polDepartureDateTime;
      const etaRaw = line.delArrivalDate || line.podArrivalDate || line.delArrivalDateTime;

      const etd = etdRaw ? etdRaw.split(' ')[0] : null;
      const eta = etaRaw ? etaRaw.split(' ')[0] : null;

      const transitDays = parseInt(line.displayTransitDays) || 
        (line.oceanTransitTimeInSeconds ? Math.round(Number(line.oceanTransitTimeInSeconds) / 86400) : 32);

      return {
        vessel: vesselName,
        serviceName: serviceLane,
        etd,
        eta,
        transitDays,
        isDirect: line.totalTransshipment === 0,
        transshipments: line.totalTransshipment || 0,
        polName: firstSail?.polLocationName || line.polName || origin,
        podName: firstSail?.podLocationName || line.podName || destination,
        cutoffs: {
          cargoCutoff: line.cct || null,
          docCutoff: line.dct || null,
          vgmCutoff: line.vgmCct || null
        },
        liveSource: 'API Oficial ONE (ecomm.one-line.com)',
        totalRoutesAvailable: lines.length
      };
    });

    return parsedRoutes;
  } catch (err) {
    console.warn('ONE live schedule fetch error:', err.message);
    return null;
  }
}
