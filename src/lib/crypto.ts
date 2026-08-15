/**
 * Web Crypto API PBKDF2 Password Hashing & Constant-Time Verification
 * Compatible with Edge Runtime and Node.js
 */

const ITERATIONS = 100_000;
const KEY_LENGTH = 32; // 256-bit
const DIGEST = "SHA-256";

/**
 * Constant-time string comparison to prevent timing attack vulnerabilities.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Converts ArrayBuffer to Hex String
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Converts Hex String to Uint8Array
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Hashes a plaintext password using PBKDF2 + SHA-256 + 100k iterations with unique 16-byte salt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as ArrayBuffer,
      iterations: ITERATIONS,
      hash: DIGEST,
    },
    passwordKey,
    KEY_LENGTH * 8
  );

  const saltHex = bufferToHex(salt.buffer);
  const hashHex = bufferToHex(derivedKey);

  return `${saltHex}:${hashHex}`;
}

/**
 * Verifies a password against a stored PBKDF2 hash using timing-safe comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [saltHex, expectedHashHex] = storedHash.split(":");
  if (!saltHex || !expectedHashHex) {
    return false;
  }

  const salt = hexToBuffer(saltHex);
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as ArrayBuffer,
      iterations: ITERATIONS,
      hash: DIGEST,
    },
    passwordKey,
    KEY_LENGTH * 8
  );

  const calculatedHashHex = bufferToHex(derivedKey);
  return timingSafeEqual(calculatedHashHex, expectedHashHex);
}
