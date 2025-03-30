import { memo } from 'react';

import { ChatEvent } from '@/features/chats';
import { SendChatThread } from '@/features/chats/chat-threads/components';

import { Spinner } from '@/shared/components/spinner';
import { getNostrLink } from '@/shared/utils';

import { useChatThreads } from './hooks';

export const ChatThreads = memo(() => {
  const { isLoadingThreads, threads } = useChatThreads();

  return (
    <div className="overflow-y-auto flex flex-col items-center p-2 gap-2">
      <SendChatThread />

      {isLoadingThreads && <Spinner />}

      {!isLoadingThreads && !threads && (
        <div className="w-full p-2 text-center">No threads found</div>
      )}

      <div className="flex flex-col-reverse gap-2 items-center w-full sm:w-3/4">
        {threads?.map((thread) => (
          <ChatEvent key={thread.id} event={getNostrLink(thread.id, thread.pubkey, 11) || ''} />
        ))}
      </div>
    </div>
  );
});
