// import { AnimatePresence, motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Muted } from '@/shared/components/ui/typography/muted';

import { ChatListDateBadge, ChatListItem } from '@/features/chats';

import { cn, sameDay } from '@/shared/utils';

import { useChatList } from './hooks';

// TODO: Fix Animate Bugs

export function ChatList() {
  const {
    messagesContainerRef,
    messageRefs,
    setDeletedMessages,
    scrollToMessage,
    activeUser,
    processedMessages,
    loadMore,
    hasMore,
  } = useChatList();

  return (
    <div className="w-full overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        id="scrollableDiv"
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col-reverse bg-background"
      >
        {/* <AnimatePresence> */}
        <InfiniteScroll
          dataLength={processedMessages.length}
          next={loadMore}
          className="flex flex-col"
          inverse={true}
          hasMore={hasMore}
          loader={<Muted>Loading...</Muted>}
          scrollThreshold={'300px'}
          scrollableTarget="scrollableDiv"
        >
          {processedMessages.map((message, i, arr) => (
            <div
              key={message.id}
              // layout
              // initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              // animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              // exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              // transition={{
              //   opacity: { duration: 0.1 },
              //   layout: {
              //     type: 'spring',
              //     bounce: 0.3,
              //     duration: processedMessages.indexOf(message) * 0.05 + 0.2,
              //   },
              // }}
              // style={{
              //   originX: 0.5,
              //   originY: 0.5,
              // }}
              className={cn(
                'flex flex-col gap-2 whitespace-pre-wrap',
                message.authorPublicKey !== activeUser?.pubkey ? 'items-start' : 'items-end mr-2',
              )}
              ref={(el) => {
                messageRefs.current[message.id] = el;
              }}
            >
              {(i == 0 || !sameDay(message.createdAt, processedMessages[i - 1].createdAt)) && (
                <ChatListDateBadge date={new Date(message.createdAt * 1000)} />
              )}
              <ChatListItem
                message={message}
                setDeletedMessages={setDeletedMessages}
                scrollToMessage={scrollToMessage}
                itemIndex={i}
                messages={arr}
              />
            </div>
          ))}
        </InfiniteScroll>

        {/* </AnimatePresence> */}
      </div>
    </div>
  );
}
