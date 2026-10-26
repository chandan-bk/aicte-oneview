/**
 * Real Cryptographic SHA-256 Hashing and Audit Chain Verification
 * Complies with FIPS 180-4 standard with full UTF-8 byte encoding (supporting Hindi, Devanagari, and multilingual text).
 */

export const GENESIS_BLOCK_HASH = 'GENESIS-BLOCK-AICTE-SAMANVAY';

/**
 * Pure TypeScript UTF-8 byte encoder
 */
function utf8Encode(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let codePoint = str.charCodeAt(i);
    if (codePoint < 0x80) {
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint < 0xd800 || codePoint >= 0xe000) {
      bytes.push(
        0xe0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    } else {
      // Surrogate pair
      i++;
      const next = str.charCodeAt(i);
      codePoint = 0x10000 + (((codePoint & 0x3ff) << 10) | (next & 0x3ff));
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    }
  }
  return new Uint8Array(bytes);
}

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

/**
 * Synchronous standard SHA-256 implementation over UTF-8 byte array
 */
function sha256Bytes(bytes: Uint8Array): string {
  const byteLength = bytes.length;
  const bitLength = byteLength * 8;

  // Number of 32-bit words needed: message + 1 byte (0x80) + 8 bytes (length) rounded up to multiple of 64 bytes (16 words)
  const wordCount = (((byteLength + 8) >> 6) + 1) * 16;
  const words = new Uint32Array(wordCount);

  // Pack bytes into 32-bit big-endian words
  for (let i = 0; i < byteLength; i++) {
    words[i >> 2] |= (bytes[i] & 0xff) << (24 - 8 * (i % 4));
  }

  // Append 0x80 padding bit
  words[byteLength >> 2] |= 0x80 << (24 - 8 * (byteLength % 4));

  // Append 64-bit length in bits (big-endian) at the end of the block
  words[wordCount - 1] = bitLength & 0xffffffff;
  words[wordCount - 2] = Math.floor(bitLength / 0x100000000);

  // Initial SHA-256 hash state
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const w = new Uint32Array(64);

  // Process 512-bit (16-word) chunks
  for (let i = 0; i < wordCount; i += 16) {
    for (let j = 0; j < 16; j++) {
      w[j] = words[i + j];
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let j = 0; j < 64; j++) {
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + k[j] + w[j]) | 0;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  // Format as 64-char hex string
  const toHex = (val: number) => (val >>> 0).toString(16).padStart(8, '0');
  return `${toHex(h0)}${toHex(h1)}${toHex(h2)}${toHex(h3)}${toHex(h4)}${toHex(h5)}${toHex(h6)}${toHex(h7)}`;
}

/**
 * Computes a true SHA-256 hash for an audit log entry payload with UTF-8 byte encoding
 */
export function computeAuditHash(
  timestamp: string,
  actor: string,
  action: string,
  entityId: string,
  details: string,
  previousHash: string = GENESIS_BLOCK_HASH
): string {
  const payload = `${timestamp}|${actor}|${action}|${entityId}|${details}|${previousHash}`;
  const utf8Bytes = utf8Encode(payload);
  return `SHA256:${sha256Bytes(utf8Bytes)}`;
}

export interface ChainVerificationResult {
  isValid: boolean;
  verifiedCount: number;
  brokenIndex?: number;
  errorDetails?: string;
  genesisVerified: boolean;
  linksVerified: number;
}

/**
 * Verifies the complete cryptographic integrity of the audit log chain:
 * 1. Checks that logs are correctly ordered newest-first.
 * 2. Recalculates and verifies each record's SHA-256 hash against its actual payload.
 * 3. Verifies that every record's previousHash strictly matches its predecessor's hash (record[i].previousHash === record[i+1].hash).
 * 4. Verifies the genesis anchor at the bottom of the chain (record[N-1].previousHash === GENESIS_BLOCK_HASH).
 */
export function verifyAuditChain(logs: Array<{
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityId: string;
  details: string;
  hash: string;
  previousHash?: string;
}>): ChainVerificationResult {
  if (!logs || logs.length === 0) {
    return {
      isValid: true,
      verifiedCount: 0,
      genesisVerified: false,
      linksVerified: 0,
      errorDetails: 'Audit trail contains no records to verify.'
    };
  }

  const n = logs.length;
  let linksVerified = 0;

  // Newest-first chain verification:
  // logs[0] = newest log
  // logs[n - 1] = oldest log (points to genesis block)
  for (let i = 0; i < n; i++) {
    const record = logs[i];
    const prevHash = record.previousHash || GENESIS_BLOCK_HASH;

    // 1. Recalculate and verify record payload hash
    const expectedHash = computeAuditHash(
      record.timestamp,
      record.actor,
      record.action,
      record.entityId,
      record.details,
      prevHash
    );

    if (record.hash !== expectedHash) {
      return {
        isValid: false,
        verifiedCount: i,
        brokenIndex: i,
        errorDetails: `Hash mismatch at record index ${i} (${record.id}). Payload has been altered or tampered with! Expected ${expectedHash.slice(0, 18)}..., found ${record.hash.slice(0, 18)}...`,
        genesisVerified: false,
        linksVerified
      };
    }

    // 2. Verify predecessor link
    if (i < n - 1) {
      const predecessor = logs[i + 1];
      if (record.previousHash !== predecessor.hash) {
        return {
          isValid: false,
          verifiedCount: i,
          brokenIndex: i,
          errorDetails: `Chain link broken between record ${i} (${record.id}) and its predecessor ${i + 1} (${predecessor.id}). Record's previousHash does not match predecessor's hash.`,
          genesisVerified: false,
          linksVerified
        };
      }
      linksVerified++;
    } else {
      // 3. Genesis anchor verification for oldest record (logs[n - 1])
      if (record.previousHash !== GENESIS_BLOCK_HASH) {
        return {
          isValid: false,
          verifiedCount: i,
          brokenIndex: i,
          errorDetails: `Genesis link invalid at base record ${i} (${record.id}). Expected anchor "${GENESIS_BLOCK_HASH}", found "${record.previousHash}".`,
          genesisVerified: false,
          linksVerified
        };
      }
    }
  }

  return {
    isValid: true,
    verifiedCount: n,
    genesisVerified: true,
    linksVerified
  };
}