import { AnimatePresence, motion } from 'framer-motion';
import { FileImage, Mic, Paperclip, PlusCircle, SendHorizontal, ThumbsUp } from 'lucide-react';

import { EmojiPicker } from '@/shared/components/emoji-picker';
import { buttonVariants } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Textarea } from '@/shared/components/ui/textarea';

import { cn } from '@/shared/utils';

import { useChatBottomBar } from './hooks';

const BottomBarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export const ChatBottomBar = () => {
  const {
    inputRef,
    message,
    setMessage,
    isMember,
    isAdmin,
    replyTo,
    setReplyTo,
    handleThumbsUp,
    handleSend,
    handleKeyPress,
    sendJoinRequest,
    openLoginModal,
    activeUser,
    messages,
  } = useChatBottomBar();

  if (!activeUser) {
    return (
      <div className="p-2 flex flex-col w-full items-center gap-2">
        <button
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          onClick={() => openLoginModal()}
        >
          To send messages, please login first.
        </button>
      </div>
    );
  }

  if (!isMember && !isAdmin) {
    return (
      <div className="p-2 flex flex-col w-full items-center gap-2">
        <button
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          onClick={sendJoinRequest}
        >
          Send Join Request
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center gap-2">
      {replyTo && (
        <div className="p-2 bg-accent border-t w-full flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Replying to:{' '}
            {messages?.find((msg) => msg.id === replyTo.id)?.content || 'Deleted message'}
          </span>
          <button onClick={() => setReplyTo(undefined)} className="text-sm ml-2">
            Cancel
          </button>
        </div>
      )}
      <div className="flex justify-between w-full items-center gap-2">
        <div className="flex">
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'h-9 w-9',
                  'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-accent-foreground',
                )}
              >
                <PlusCircle size={20} className="text-muted-foreground" />
              </div>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-full p-2">
              {message.trim() ? (
                <div className="flex gap-2">
                  <div
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'h-9 w-9',
                      'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-accent-foreground',
                    )}
                  >
                    <Mic size={20} className="text-muted-foreground" />
                  </div>
                  {BottomBarIcons.map((icon, index) => (
                    <div
                      key={index}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'icon' }),
                        'h-9 w-9',
                        'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-accent-foreground',
                      )}
                    >
                      <icon.icon size={20} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'h-9 w-9',
                    'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-accent-foreground',
                  )}
                >
                  <Mic size={20} className="text-muted-foreground" />
                </div>
              )}
            </PopoverContent>
          </Popover>
          {!message.trim() && (
            <div className="flex">
              {BottomBarIcons.map((icon, index) => (
                <div
                  key={index}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'h-9 w-9',
                    'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-accent-foreground',
                  )}
                >
                  <icon.icon size={20} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: {
                type: 'spring',
                bounce: 0.15,
              },
            }}
          >
            <Textarea
              autoComplete="off"
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={(event) => setMessage(event.target.value)}
              name="message"
              placeholder="Write a message..."
              className="w-full border rounded-full flex items-center h-10 resize-none overflow-hidden bg-background"
            ></Textarea>
            <div className="absolute right-2 bottom-2.5 flex gap-2">
              <EmojiPicker
                onChange={(value) => {
                  setMessage(message + value);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              />
            </div>
          </motion.div>

          {message.trim() ? (
            <div
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-9 w-9',
                'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-accent-foreground shrink-0',
              )}
              onClick={handleSend}
            >
              <SendHorizontal size={20} className="text-muted-foreground" />
            </div>
          ) : (
            <div
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-9 w-9',
                'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-accent-foreground shrink-0',
              )}
              onClick={handleThumbsUp}
            >
              <ThumbsUp size={20} className="text-muted-foreground" />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
