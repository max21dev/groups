import { nip19 } from 'nostr-tools';

export const getNostrLink = (
  eventId: string,
  pubkey: string | undefined,
  kind: number | undefined,
) => {
  try {
    const neventLink = nip19.neventEncode({
      id: eventId,
      author: pubkey,
      kind,
    });

    return neventLink;
  } catch (error) {
    console.error('Error encoding Nostr link:', error);
    return null;
  }
};
