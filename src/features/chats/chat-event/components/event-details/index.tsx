import { nip19 } from 'nostr-tools';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChatEvent } from '@/features/chats';
import { EventCategory } from '@/features/chats/chat-event/types';
import { EVENT_CATEGORY_MAP } from '@/features/chats/chat-event/utils';
import { ChatThreadComments } from '@/features/chats/chat-threads/components';

import { Button } from '@/shared/components/ui/button';
import { useActiveGroup, useActiveRelay } from '@/shared/hooks';

export const EventDetails = ({ event }: { event: string }) => {
  const { activeGroupId, isCommunity } = useActiveGroup();
  const { activeRelay } = useActiveRelay();

  const navigate = useNavigate();

  const { kind, eventId } = useMemo(() => {
    try {
      const decodedEvent = nip19.decode(event);
      if (
        decodedEvent &&
        decodedEvent.data &&
        typeof decodedEvent.data === 'object' &&
        'kind' in decodedEvent.data &&
        'id' in decodedEvent.data
      ) {
        const mappedKind = EVENT_CATEGORY_MAP[decodedEvent.data.kind as number];
        return {
          kind: mappedKind ?? null,
          eventId: decodedEvent.data.id as string,
        };
      }
    } catch (error) {
      console.error('Error decoding event:', error);
    }

    return {
      kind: null as EventCategory | null,
      eventId: null as string | null,
    };
  }, [event]);

  const handleBackClick = () => {
    if (isCommunity) {
      navigate(-1);
      return;
    }

    if (kind === 'thread') {
      navigate(`/threads?relay=${activeRelay}&groupId=${activeGroupId}`);
    } else if (kind === 'poll') {
      navigate(`/polls?relay=${activeRelay}&groupId=${activeGroupId}`);
    } else {
      navigate(-1);
    }
  };

  const backButtonText = useMemo(() => {
    if (isCommunity) return 'Back';
    if (kind === 'thread') return 'Back to threads';
    if (kind === 'poll') return 'Back to Polls';
    return 'Back';
  }, [isCommunity, kind]);

  return (
    <div className="flex flex-col items-center px-2 py-8 h-full overflow-y-auto">
      <div className="w-full max-w-2xl">
        <Button variant="outline" className="me-auto mb-2" onClick={handleBackClick}>
          {backButtonText}
        </Button>
      </div>

      <ChatEvent event={event} />
      {kind === 'thread' && <ChatThreadComments parentId={eventId || ''} />}
    </div>
  );
};
