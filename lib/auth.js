// Secure Session Authentication for Almar Multicotizador
// Compatible with both Node.js server runtime and Edge Middleware (Web Crypto API)

const AUTH_SECRET = process.env.AUTH_SECRET || 'almar-freight-intel-secret-key-salt-2026';

// Permitted users for Almar Rosario operations
export const VALID_USERS = [
  'almar',
  'expo@almarrosario.com',
  'jarloro@almarrosario.com',
  'operaciones'
];

export function validateCredentials(username, password) {
  const validUser = (process.env.AUTH_USER || 'almar').toLowerCase();
  const validPass = process.env.AUTH_PASSWORD || 'Almar2026!';

  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const isUserAllowed = VALID_USERS.includes(cleanUser) || cleanUser === validUser;
  const isPassCorrect = cleanPass === validPass;

  return isUserAllowed && isPassCorrect;
}

// Convert ArrayBuffer to Hex string
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// HMAC-SHA256 signature using Web Crypto API
async function signMessage(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return bufferToHex(signature);
}

// Generate secure session token: base64(username:expiry:signature)
export async function createSessionToken(username, daysValid = 7) {
  const expiry = Date.now() + daysValid * 24 * 60 * 60 * 1000;
  const message = `${username}:${expiry}`;
  const signature = await signMessage(message, AUTH_SECRET);
  const tokenString = `${message}:${signature}`;
  return btoa(tokenString);
}

// Verify secure session token
export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false;

  try {
    const decoded = atob(token);
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;

    const [username, expiryStr, signature] = parts;
    const expiry = parseInt(expiryStr, 10);

    if (isNaN(expiry) || Date.now() > expiry) {
      return false; // Token expired
    }

    const message = `${username}:${expiry}`;
    const expectedSignature = await signMessage(message, AUTH_SECRET);

    // Constant time comparison
    if (signature.length !== expectedSignature.length) return false;
    let match = true;
    for (let i = 0; i < signature.length; i++) {
      if (signature[i] !== expectedSignature[i]) match = false;
    }

    return match;
  } catch (err) {
    return false;
  }
}
