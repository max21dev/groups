import { nip44 } from 'nostr-tools';

export function serializeSettings(settings: any) {
  return {
    ...settings,
    notif_exceptions: Object.fromEntries(
      [...settings.notif_exceptions].map(([relay, groups]) => [relay, Object.fromEntries(groups)]),
    ),
    last_seen_groups: Object.fromEntries(
      [...settings.last_seen_groups].map(([relay, groups]) => [relay, Object.fromEntries(groups)]),
    ),
  };
}

export function deserializeSettings(data: any) {
  return {
    ...data,
    notif_exceptions: new Map(
      Object.entries(data.notif_exceptions || {}).map(([relay, groups]) => [
        relay,
        new Map(Object.entries(groups as Record<string, boolean>)),
      ]),
    ),
    last_seen_groups: new Map(
      Object.entries(data.last_seen_groups || {}).map(([relay, groups]) => [
        relay,
        new Map(Object.entries(groups as Record<string, number>)),
      ]),
    ),
  };
}

export function encryptUserSettings(settings: any, privateKey: string, pubkey: string) {
  const privateKeyBytes = hexToUint8Array(privateKey);
  const conversationKey = nip44.getConversationKey(privateKeyBytes, pubkey);
  return nip44.encrypt(JSON.stringify(settings), conversationKey);
}

export function decryptUserSettings(encryptedData: string, privateKey: string, pubkey: string) {
  try {
    const privateKeyBytes = hexToUint8Array(privateKey);
    const conversationKey = nip44.getConversationKey(privateKeyBytes, pubkey);
    return JSON.parse(nip44.decrypt(encryptedData, conversationKey));
  } catch (error) {
    console.error('Decryption failed.');
    return null;
  }
}

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
}
