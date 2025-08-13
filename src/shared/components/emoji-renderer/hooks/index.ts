import { NDKFilter, NDKKind, NDKRelaySet, NDKSubscriptionCacheUsage } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useCallback, useEffect, useState } from 'react';

import { discoveryRelays } from '@/features/users/user-wallets/configs';

import { EmojiSet, loadCachedEmojiSets, upsertEmojiSetsInCache } from '@/shared/lib/db/emojiCache';

import { convertEventToEmojiSet } from '../utils';

export const useEmojiRenderer = () => {
  const [emojiSets, setEmojiSets] = useState<EmojiSet[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { ndk } = useNdk();

  useEffect(() => {
    if (!ndk) return;

    (async () => {
      try {
        const cached = await loadCachedEmojiSets();
        if (cached.length > 0) setEmojiSets(cached);

        const relayUrls = new Set<string>(discoveryRelays || []);
        const relaySet = relayUrls.size
          ? NDKRelaySet.fromRelayUrls([...relayUrls], ndk)
          : undefined;

        const filter: NDKFilter = { kinds: [NDKKind.EmojiSet], limit: 200 };

        const events = await ndk.fetchEvents(
          filter,
          { closeOnEose: true, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST },
          relaySet,
        );

        const incoming: EmojiSet[] = [];
        for (const ev of events) {
          const set = convertEventToEmojiSet(ev);
          if (set) incoming.push(set);
        }

        setEmojiSets((prev) => {
          const merged = [...prev];
          for (const ns of incoming) {
            const i = merged.findIndex((x) => x.address === ns.address);
            if (i >= 0) {
              if (ns.createdAt > merged[i].createdAt) merged[i] = ns;
            } else {
              merged.push(ns);
            }
          }
          upsertEmojiSetsInCache(merged);
          return merged;
        });
      } catch (e: any) {
        console.error('Error fetching emoji sets:', e);
        setError(e?.message || 'Error fetching emoji sets');
      }
    })();
  }, [ndk]);

  const findEmoji = useCallback(
    (shortcode: string) => {
      const cleanShortcode = shortcode.replace(/^:|:$/g, '');
      for (const set of emojiSets) {
        const emoji = set.emojis.find((e) => e.name === cleanShortcode);
        if (emoji) return { emoji, set };
      }
      return null;
    },
    [emojiSets],
  );

  return {
    data: emojiSets.length ? emojiSets : null,
    error,
    findEmoji,
  };
};
