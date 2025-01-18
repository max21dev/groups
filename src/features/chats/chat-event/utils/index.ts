import { NDKEvent } from '@nostr-dev-kit/ndk';

export const fetchReactions = async (ndk: any, eventId: string): Promise<NDKEvent[]> => {
  if (!ndk) return [];

  const reactions = await ndk.fetchEvents({
    kinds: [7],
    '#e': [eventId],
  });

  return Array.from(reactions || []);
};
