import { ChatEvent } from '@/features/chats';

import { Spinner } from '@/shared/components/spinner';

import { useChatThreads } from './hooks';

export const ChatThreads = () => {
  const { isLoadingThreads, threads } = useChatThreads();

  if (isLoadingThreads) return <Spinner />;

  if (!isLoadingThreads && !threads) return <div>No threads found</div>;

  return (
    <div className="overflow-y-auto flex flex-col items-center p-2">
      <div className="flex flex-col-reverse gap-2">
        {threads?.map((thread) => <ChatEvent key={thread.id} event={thread.id} />)}
      </div>
    </div>
  );
};
