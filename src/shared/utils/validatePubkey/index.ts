import { publicKeyVerify } from 'secp256k1';

export function validatePubKey(pubkey: string): boolean {
  const compressedKey = addPrefixToPubkey(pubkey);
  if (!compressedKey) {
    return false;
  }

  try {
    return publicKeyVerify(compressedKey);
  } catch (error) {
    console.error(error);
    return false;
  }
}

function addPrefixToPubkey(pubkey: string): Uint8Array | null {
  const hexRegex = /^[0-9a-f]{64}$/i;
  if (!hexRegex.test(pubkey)) {
    return null;
  }

  const keyBytes = hexToUint8Array(pubkey);

  const compressedKey = new Uint8Array(33);
  compressedKey[0] = 0x02;
  compressedKey.set(keyBytes, 1);
  return compressedKey;
}

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
}
