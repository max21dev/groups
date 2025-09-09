import { memo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { ChatEvent } from '@/features/chats';
import { SendChatThread } from '@/features/chats/chat-threads/components';

import { Spinner } from '@/shared/components/spinner';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { getNostrLink } from '@/shared/utils';

import { useChatThreads } from './hooks';

export const ChatThreads = memo(() => {
  const { isLoadingThreads, threads, hasMoreThreads, loadMoreThreads } = useChatThreads();

  return (
    <ScrollArea
      viewportProps={{
        className: '[&>div]:!flex [&>div]:!flex-col [&>div]:!gap-2 p-2 h-full',
        id: 'scrollableChatThreads',
      }}
    >
      <div className="flex flex-col gap-2 items-center">
        <SendChatThread />

        {isLoadingThreads && <Spinner />}

        {!isLoadingThreads && !threads && (
          <div className="w-full p-2 text-center">No threads found</div>
        )}
      </div>

      <InfiniteScroll
        dataLength={threads?.length ?? 0}
        next={loadMoreThreads}
        hasMore={!!hasMoreThreads}
        loader={<Spinner />}
        className="flex flex-col-reverse gap-2 items-center"
        scrollThreshold={'300px'}
        scrollableTarget="scrollableChatThreads"
        style={{ overflow: 'visible' }}
      >
        {threads?.map((thread) => (
          <ChatEvent key={thread.id} event={getNostrLink(thread.id, thread.pubkey, 11) || ''} />
        ))}
      </InfiniteScroll>
    </ScrollArea>
  );
});
