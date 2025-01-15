// import { AnimatePresence, motion } from 'framer-motion';
import { Nip29GroupChat } from 'nostr-hooks/nip29';
import { memo } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import UserJoinLeaveBadge from '@/features/users/user-join-leave-badge';

import { Muted } from '@/shared/components/ui/typography/muted';

import { cn, sameDay } from '@/shared/utils';

import { ChatListDateBadge, ChatListItem } from './components';
import { useChatList } from './hooks';

// TODO: Fix Animate Bugs

export const ChatList = memo(() => {
  const {
    chatsContainerRef,
    chatRefs,
    setDeletedChats,
    scrollToChat,
    activeUser,
    processedChats,
    loadMore,
    hasMore,
    chatsEvents,
    topChat,
    bottomChat,
    joinRequests,
    leaveRequests,
  } = useChatList();

  const combinedList = [
    ...(processedChats || []).map((chat) => ({
      content: chat,
      type: 'chat',
      timestamp: chat.timestamp,
    })),
    ...(joinRequests ?? []).map((join) => ({
      content: join,
      type: 'join',
      timestamp: join.timestamp,
    })),
    ...(leaveRequests ?? []).map((leave) => ({
      content: leave,
      type: 'leave',
      timestamp: leave.timestamp,
    })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  if (!combinedList) return null;

  return (
    <div className="w-full overflow-x-hidden h-full flex flex-col">
      <div
        ref={chatsContainerRef}
        id="scrollableDiv"
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col-reverse bg-background"
      >
        {/* <AnimatePresence> */}
        <InfiniteScroll
          dataLength={combinedList.length}
          next={loadMore}
          className="flex flex-col"
          inverse={true}
          hasMore={!!hasMore}
          loader={<Muted>Loading...</Muted>}
          scrollThreshold={'300px'}
          scrollableTarget="scrollableDiv"
        >
          {combinedList.map((item, i, arr) => (
            <div
              key={item.content.id}
              // layout
              // initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              // animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              // exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              // transition={{
              //   opacity: { duration: 0.1 },
              //   layout: {
              //     type: 'spring',
              //     bounce: 0.3,
              //     duration: processedChats.indexOf(chat) * 0.05 + 0.2,
              //   },
              // }}
              // style={{
              //   originX: 0.5,
              //   originY: 0.5,
              // }}
              className={cn(
                'flex flex-col gap-2 whitespace-pre-wrap',
                item.content.pubkey !== activeUser?.pubkey ? 'items-start' : 'items-end mr-2',
              )}
              ref={(el) => {
                chatRefs.current[item.content.id] = el;
              }}
            >
              {(i == 0 || !sameDay(item.content.timestamp, arr[i - 1].timestamp)) && (
                <ChatListDateBadge date={new Date(item.content.timestamp * 1000)} />
              )}
              {item.type === 'chat' && (
                <ChatListItem
                  chat={item.type === 'chat' ? (item.content as Nip29GroupChat) : undefined}
                  setDeletedChats={setDeletedChats}
                  scrollToChat={scrollToChat}
                  chats={processedChats || []}
                  chatsEvents={chatsEvents}
                  topChat={topChat}
                  bottomChat={bottomChat}
                  nextChat={
                    arr[i + 1]?.type === 'chat' ? (arr[i + 1].content as Nip29GroupChat) : undefined
                  }
                />
              )}

              {item.type === 'join' && <UserJoinLeaveBadge request={item.content} type="join" />}
              {item.type === 'leave' && <UserJoinLeaveBadge request={item.content} type="leave" />}
            </div>
          ))}
        </InfiniteScroll>
        {/* </AnimatePresence> */}
      </div>
    </div>
  );
});
