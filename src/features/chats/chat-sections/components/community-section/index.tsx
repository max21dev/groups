import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { ChatEvent } from '@/features/chats';

import { Spinner } from '@/shared/components/spinner';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
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
        { kinds: [30222], '#k': kinds.map((k) => String(k)), '#h': [groupId], limit: 50 } as any,
        { kinds: kinds, '#h': [groupId], limit: 50 },
      ];

      const all = new Map<string, NDKEvent>();

      for (const filter of filters) {
        const fetched = await ndk.fetchEvents(filter as any, { closeOnEose: true });
        fetched.forEach((ev) => {
          if (ev.id) all.set(ev.id, ev);
        });
      }

      const eventsArray = Array.from(all.values()).sort(
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
    <ScrollArea viewportProps={{ className: 'w-full [&>div]:!block [&>div]:w-0 h-full' }}>
      <div className="flex flex-col items-center gap-2 px-2 py-8 h-full">
        {events.map((event) => {
          const eventLink =
            event.kind === 30222 &&
            typeof event.content === 'string' &&
            event.content.trim().startsWith('n')
              ? event.content.trim()
              : getNostrLink(event.id!, event.pubkey, event.kind) || event.id!;

          return <ChatEvent key={event.id} event={eventLink} />;
        })}
      </div>
    </ScrollArea>
  );
};
