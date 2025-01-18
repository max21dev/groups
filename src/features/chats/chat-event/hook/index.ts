import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { useHomePage } from '@/pages/home/hooks';

import { fetchReactions } from '../utils';

type EventCategory = 'follow-set' | 'group' | 'note' | 'long-form-content';

export const useChatEvent = (event: string) => {
  const [eventData, setEventData] = useState<NDKEvent | null | undefined>(undefined);
  const [reactions, setReactions] = useState<NDKEvent[] | null | undefined>([]);
  const [category, setCategory] = useState<EventCategory | null | undefined>(undefined);
  const { profile } = useProfile({ pubkey: eventData?.pubkey });

  const { ndk } = useNdk();

  const { isThreadsVisible } = useHomePage();

  useEffect(() => {
    ndk?.fetchEvent(event).then(async (event) => {
      if (event && event.kind) {
        if (event.kind === 1 || event.kind === 11 || event.kind === 1111) {
          setCategory('note');
        } else if (event.kind === 30000) {
          setCategory('follow-set');
        } else if (event.kind === 30023) {
          setCategory('long-form-content');
        } else if (event.kind >= 39000 && event.kind <= 39009) {
          setCategory('group');
        }

        setEventData(event);

        const fetchedReactions = await fetchReactions(ndk, event.id);
        setReactions(fetchedReactions);
      } else {
        setEventData(null);
        setCategory(null);
        setReactions([]);
      }
    });
  }, [event, ndk]);

  const refreshReactions = async () => {
    if (!eventData || !ndk) return;

    const fetchedReactions = await fetchReactions(ndk, eventData.id);
    setReactions(fetchedReactions);
  };

  return { eventData, profile, category, reactions, refreshReactions, isThreadsVisible };
};
