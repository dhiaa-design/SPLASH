/**
 * Layanan Hash Kriptografi Web Crypto API (SHA-256)
 * Memastikan kata sandi tidak disimpan dalam bentuk teks asli (plain text).
 */

export async function hashPassword(plainTextPassword) {
  if (!plainTextPassword) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(plainTextPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(plainTextPassword, storedHash) {
  const inputHash = await hashPassword(plainTextPassword);
  return inputHash === storedHash;
}
