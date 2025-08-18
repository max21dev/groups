import { NostrEvent } from '@nostr-dev-kit/ndk';

import { ChatEvent } from '@/features/chats';

import { Spinner } from '@/shared/components/spinner';

import { useTargetedPublication } from './hooks';

export const TargetedPublication = ({ event }: { event: NostrEvent }) => {
  const { target, targetLink } = useTargetedPublication(event);

  if (target === undefined) {
    return (
      <div className="flex justify-center items-center h-24">
        <Spinner />
      </div>
    );
  }

  if (target === null) {
    return (
      <div className="text-sm text-muted-foreground p-2 rounded bg-primary/5">
        Target publication not found.
      </div>
    );
  }

  return <ChatEvent event={targetLink} />;
};
