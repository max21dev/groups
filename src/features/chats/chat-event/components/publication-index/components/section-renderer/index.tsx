import { PublicationContent } from '@/features/chats/chat-event/components';
import { useChatEvent } from '@/features/chats/chat-event/hook';

import { Skeleton } from '@/shared/components/ui/skeleton';

export const SectionRenderer = ({ eventLink }: { eventLink: string }) => {
  const { eventData, eventRef } = useChatEvent(eventLink);

  if (!eventData) {
    return (
      <div ref={eventRef} className="text-center p-8">
        <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return (
    <div ref={eventRef}>
      <PublicationContent event={eventData} />
    </div>
  );
};
