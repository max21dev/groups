import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

type EventCategory = 'follow-set' | 'group' | 'note' | 'long-form-content';

export const useChatEvent = (event: string) => {
  const [eventData, setEventData] = useState<NDKEvent | null | undefined>(undefined);
  const [category, setCategory] = useState<EventCategory | null | undefined>(undefined);
  const { profile } = useProfile({ pubkey: eventData?.pubkey });

  const { ndk } = useNdk();

  useEffect(() => {
    ndk?.fetchEvent(event).then((event) => {
      if (event && event.kind) {
        if (event.kind === 1) {
          setCategory('note');
        } else if (event.kind === 30000) {
          setCategory('follow-set');
        } else if (event.kind === 30023) {
          setCategory('long-form-content');
        } else if (event.kind >= 39000 && event.kind <= 39009) {
          setCategory('group');
        }

        setEventData(event);
      } else {
        setEventData(null);
        setCategory(null);
      }
    });
  }, [event, ndk, setEventData, setCategory]);

  return { eventData, profile, category };
};
