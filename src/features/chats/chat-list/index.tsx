// import { AnimatePresence, motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Muted } from '@/shared/components/ui/typography/muted';

import { cn, sameDay } from '@/shared/utils';

import { ChatListDateBadge, ChatListItem } from './components';
import { useChatList } from './hooks';

// TODO: Fix Animate Bugs

export function ChatList() {
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
  } = useChatList();

  if (!processedChats) return null;

  return (
    <div className="w-full overflow-x-hidden h-full flex flex-col">
      <div
        ref={chatsContainerRef}
        id="scrollableDiv"
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col-reverse bg-background"
      >
        {/* <AnimatePresence> */}
        <InfiniteScroll
          dataLength={processedChats.length}
          next={loadMore}
          className="flex flex-col"
          inverse={true}
          hasMore={!!hasMore}
          loader={<Muted>Loading...</Muted>}
          scrollThreshold={'300px'}
          scrollableTarget="scrollableDiv"
        >
          {processedChats.map((chat, i, arr) => (
            <div
              key={chat.id}
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
                chat.pubkey !== activeUser?.pubkey ? 'items-start' : 'items-end mr-2',
              )}
              ref={(el) => {
                chatRefs.current[chat.id] = el;
              }}
            >
              {(i == 0 || !sameDay(chat.timestamp, arr[i - 1].timestamp)) && (
                <ChatListDateBadge date={new Date(chat.timestamp * 1000)} />
              )}
              <ChatListItem
                chat={chat}
                setDeletedChats={setDeletedChats}
                scrollToChat={scrollToChat}
                chats={processedChats}
                chatsEvents={chatsEvents}
                topChat={topChat}
                bottomChat={bottomChat}
                nextChat={arr[i + 1]}
              />
            </div>
          ))}
        </InfiniteScroll>

        {/* </AnimatePresence> */}
      </div>
    </div>
  );
}
