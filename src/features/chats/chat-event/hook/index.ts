import { NDKEvent, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { useLazyLoad } from '@/shared/hooks';
import { getEventByNostrLink, saveEvent } from '@/shared/lib/db/eventCache';

import { EventCategory } from '../types';
import { EVENT_CATEGORY_MAP, fetchReactions } from '../utils';

export const useChatEvent = (eventId: string) => {
  const { ref: eventRef, hasEnteredViewport } = useLazyLoad<HTMLDivElement>();
  const [eventData, setEventData] = useState<NostrEvent | null | undefined>(undefined);
  const [reactions, setReactions] = useState<NDKEvent[] | null | undefined>([]);
  const [category, setCategory] = useState<EventCategory | null | undefined>(undefined);
  const [isLoadingFromCache, setIsLoadingFromCache] = useState(false);
  const { profile } = useProfile({ pubkey: eventData?.pubkey });

  const { ndk } = useNdk();

  useEffect(() => {
    if (!eventId) return;

    setIsLoadingFromCache(true);
    getEventByNostrLink(eventId)
      .then((cachedEvent) => {
        if (cachedEvent) {
          setEventData(cachedEvent);

          if (cachedEvent.kind) {
            const mappedCategory = EVENT_CATEGORY_MAP[cachedEvent.kind];
            setCategory(mappedCategory ?? null);
          }

          if (ndk && cachedEvent.id) {
            fetchReactions(ndk, cachedEvent.id).then(setReactions);
          }

          return true;
        }
        return false;
      })
      .catch((error) => {
        console.error('Error fetching from cache:', error);
        return false;
      })
      .finally(() => {
        setIsLoadingFromCache(false);
      });
  }, [eventId, ndk]);

  useEffect(() => {
    if (!hasEnteredViewport || !ndk || !eventId || isLoadingFromCache) return;

    if (eventData !== undefined) return;

    ndk.fetchEvent(eventId).then(async (fetchedEvent) => {
      if (fetchedEvent && fetchedEvent.kind) {
        const mappedCategory = EVENT_CATEGORY_MAP[fetchedEvent.kind];
        const nostrEvent: NostrEvent = fetchedEvent.rawEvent();
        setCategory(mappedCategory ?? null);

        setEventData(nostrEvent);

        await saveEvent(nostrEvent, eventId);

        const fetchedReactions = await fetchReactions(ndk, fetchedEvent.id);
        setReactions(fetchedReactions);
      } else {
        setEventData(null);
        setCategory(null);
        setReactions([]);
      }
    });
  }, [eventId, ndk, hasEnteredViewport, eventData, isLoadingFromCache]);

  const refreshReactions = async () => {
    if (!eventData || !eventData.id || !ndk) return;

    const fetchedReactions = await fetchReactions(ndk, eventData.id);
    setReactions(fetchedReactions);
  };

  return {
    eventRef,
    eventData,
    profile,
    category,
    reactions,
    refreshReactions,
  };
};
