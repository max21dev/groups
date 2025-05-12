export const hexToUint8Array = (hex: string): Uint8Array => {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
};