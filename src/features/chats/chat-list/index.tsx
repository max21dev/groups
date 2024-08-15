import { AnimatePresence, motion } from 'framer-motion';

import { ChatListItem } from '@/features/chats';

import { cn } from '@/shared/utils';

import { useChatList } from './hooks';

export function ChatList() {
  const {
    messagesContainerRef,
    messageRefs,
    setDeletedMessages,
    scrollToMessage,
    activeUser,
    processedMessages,
  } = useChatList();

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col bg-gray-100 dark:bg-gray-950"
      >
        <AnimatePresence>
          {processedMessages.map((message, i, arr) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: processedMessages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                'flex flex-col gap-2 whitespace-pre-wrap',
                message.authorPublicKey !== activeUser?.pubkey ? 'items-start' : 'items-end mr-2',
              )}
              ref={(el) => {
                messageRefs.current[message.id] = el;
              }}
            >
              <ChatListItem
                message={message}
                setDeletedMessages={setDeletedMessages}
                scrollToMessage={scrollToMessage}
                itemIndex={i}
                messages={arr}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
