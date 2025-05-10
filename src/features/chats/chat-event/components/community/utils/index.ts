import { NostrEvent } from '@nostr-dev-kit/ndk';

export const getCommunityTags = (event: NostrEvent | null) => {
  if (!event) return { relayTags: [], blossomTags: [], mintTags: [] };

  const relayTags = event.tags
    .filter(([tag]: any) => tag.toLowerCase() === 'r')
    .map(([, value]: any) => value);
  const blossomTags = event.tags
    .filter(([tag]: any) => tag.toLowerCase() === 'blossom')
    .map(([, value]: any) => value);
  const mintTags = event.tags
    .filter(([tag]: any) => tag.toLowerCase() === 'mint')
    .map(([, value]: any) => value);

  return { relayTags, blossomTags, mintTags };
};
