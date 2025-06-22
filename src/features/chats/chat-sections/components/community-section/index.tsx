import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { ChatEvent } from '@/features/chats';

import { Spinner } from '@/shared/components/spinner';
import { getNostrLink } from '@/shared/utils';

export const CommunitySection = ({
  kinds,
  groupId,
  activeRelay,
}: {
  kinds: number[];
  groupId: string | undefined;
  activeRelay: string | undefined;
}) => {
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { ndk } = useNdk();

  useEffect(() => {
    if (ndk && activeRelay && groupId && kinds.length > 0) {
      fetchEvents();
    }
  }, [ndk, activeRelay, groupId, kinds]);

  const fetchEvents = async () => {
    if (!ndk || !groupId) return;

    setIsLoading(true);
    try {
      const filters = [
        { kinds: kinds, authors: [groupId], limit: 50 },
        { kinds: kinds, '#h': [groupId], limit: 50 },
      ];

      const allEvents = new Set<NDKEvent>();

      for (const filter of filters) {
        const fetchedEvents = await ndk.fetchEvents(filter);
        fetchedEvents.forEach((event) => allEvents.add(event));
      }

      const eventsArray = Array.from(allEvents).sort(
        (a, b) => (b.created_at || 0) - (a.created_at || 0),
      );

      setEvents(eventsArray);
    } catch (error) {
      console.error('Error fetching community section events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        No content available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 px-2 py-8 h-full overflow-y-auto [&_.max-w-80]:max-w-2xl">
      {events.map((event) => (
        <ChatEvent
          key={event.id}
          event={getNostrLink(event.id!, event.pubkey, event.kind) || event.id!}
        />
      ))}
    </div>
  );
};
