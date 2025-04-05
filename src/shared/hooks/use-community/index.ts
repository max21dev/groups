import { NDKEvent, NDKKind, NDKRelaySet } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { useActiveRelay } from '@/shared/hooks';
import { validatePubKey } from '@/shared/utils';

const communityCache = new Map<string, NDKEvent | null>();

export const useCommunity = (pubkey: string | undefined, relayProp?: string) => {
  const [communityEvent, setCommunityEvent] = useState<NDKEvent | null>(null);
  const { ndk } = useNdk();
  const { activeRelay } = useActiveRelay();

  const communityRelay = relayProp || activeRelay;

  useEffect(() => {
    if (!pubkey || !validatePubKey(pubkey)) {
      setCommunityEvent(null);
      return;
    }
    if (!ndk || !communityRelay) return;

    const cacheKey = `${pubkey}_${communityRelay}`;
    if (communityCache.has(cacheKey)) {
      setCommunityEvent(communityCache.get(cacheKey)!);
      return;
    }

    const fetchCommunityEvent = async () => {
      try {
        const events = await ndk.fetchEvents(
          {
            kinds: [10222 as NDKKind],
            authors: [pubkey],
          },
          {
            closeOnEose: true,
          },
          NDKRelaySet.fromRelayUrls([communityRelay], ndk),
        );
        const eventArray = Array.from(events);
        const event = eventArray.length > 0 ? eventArray[0] : null;
        setCommunityEvent(event);
        communityCache.set(cacheKey, event);
      } catch (error) {
        console.error('Error fetching community event:', error);
        setCommunityEvent(null);
        communityCache.set(cacheKey, null);
      }
    };

    fetchCommunityEvent();
  }, [pubkey, ndk, communityRelay]);

  return { isCommunity: !!communityEvent, communityEvent };
};
