import CryptoJS from "crypto-js";

/**
 * Generates a deterministic SHA-256 hash of an object or string.
 * @param {object|string} data - The data to hash.
 * @returns {string} Hex-encoded SHA-256 hash.
 */
export function generateSHA256(data) {
  const payload =
    typeof data === "string" ? data : JSON.stringify(data);
  return CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
}
