import { NDKEvent, NDKKind, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';

export const useCalendar = (event: NostrEvent) => {
  const [calendarEvents, setCalendarEvents] = useState<NDKEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { ndk } = useNdk();

  const title =
    event.tags.find((tag) => tag[0] === 'title')?.[1] ||
    event.tags.find((tag) => tag[0] === 'name')?.[1] ||
    'Untitled Calendar';
  const description =
    event.content ||
    event.tags.find((tag) => tag[0] === 'description')?.[1] ||
    event.tags.find((tag) => tag[0] === 'about')?.[1] ||
    '';

  useEffect(() => {
    if (!ndk || !event.id) return;

    const loadCalendarEvents = async () => {
      try {
        setIsLoading(true);

        const eventReferences = event.tags.filter((tag) => tag[0] === 'a').map((tag) => tag[1]);

        if (eventReferences.length === 0) {
          setCalendarEvents([]);
          return;
        }

        const eventsPromises = eventReferences.map(async (ref) => {
          const [kind, pubkey, identifier] = ref.split(':');
          const eventKind = parseInt(kind) as NDKKind;

          if (![31922, 31923].includes(eventKind)) return null;

          try {
            const events = await ndk.fetchEvents({
              kinds: [eventKind],
              authors: [pubkey],
              '#d': [identifier],
            });

            const eventArray = Array.from(events);
            if (eventArray.length === 0) return null;

            const latestEvent = eventArray.sort((a, b) => b.created_at! - a.created_at!)[0];
            return latestEvent;
          } catch (error) {
            console.error(`Error fetching calendar event ${ref}:`, error);
            return null;
          }
        });

        const resolvedEvents = await Promise.all(eventsPromises);
        const validEvents = resolvedEvents.filter((event): event is NDKEvent => event !== null);

        validEvents.sort((a, b) => {
          const aStartTime = a.tags.find((tag) => tag[0] === 'start')?.[1];
          const bStartTime = b.tags.find((tag) => tag[0] === 'start')?.[1];

          if (!aStartTime || !bStartTime) return 0;

          const aTime =
            a.kind === 31923 ? Number(aStartTime) : new Date(aStartTime).getTime() / 1000;
          const bTime =
            b.kind === 31923 ? Number(bStartTime) : new Date(bStartTime).getTime() / 1000;

          return aTime - bTime;
        });

        setCalendarEvents(validEvents);
      } catch (error) {
        console.error('Error loading calendar events:', error);
        setCalendarEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalendarEvents();
  }, [ndk, event.id, event.tags]);

  return {
    title,
    description,
    calendarEvents,
    isLoading,
  };
};