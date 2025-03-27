import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { useHomePage } from '@/pages/home/hooks';
import { useLazyLoad } from '@/shared/hooks';

import { EventCategory } from '../types';
import { EVENT_CATEGORY_MAP, fetchReactions } from '../utils';

export const useChatEvent = (eventId: string) => {
  const { ref: eventRef, hasEnteredViewport } = useLazyLoad<HTMLDivElement>();
  const [eventData, setEventData] = useState<NDKEvent | null | undefined>(undefined);
  const [reactions, setReactions] = useState<NDKEvent[] | null | undefined>([]);
  const [category, setCategory] = useState<EventCategory | null | undefined>(undefined);
  const { profile } = useProfile({ pubkey: eventData?.pubkey });

  const { ndk } = useNdk();

  const { isThreadsVisible, isPollsVisible, event } = useHomePage();

  const isChatsPage = !(isThreadsVisible || isPollsVisible || !!event);

  useEffect(() => {
    if (!hasEnteredViewport || !ndk) return;

    ndk.fetchEvent(eventId).then(async (fetchedEvent) => {
      if (fetchedEvent && fetchedEvent.kind) {
        const mappedCategory = EVENT_CATEGORY_MAP[fetchedEvent.kind];

        setCategory(mappedCategory ?? null);

        setEventData(fetchedEvent);

        const fetchedReactions = await fetchReactions(ndk, fetchedEvent.id);
        setReactions(fetchedReactions);
      } else {
        setEventData(null);
        setCategory(null);
        setReactions([]);
      }
    });
  }, [eventId, ndk, hasEnteredViewport]);

  const refreshReactions = async () => {
    if (!eventData || !ndk) return;

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
    isThreadsVisible,
    isChatsPage,
  };
};
