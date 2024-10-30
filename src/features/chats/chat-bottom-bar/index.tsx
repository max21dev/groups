import { AnimatePresence, motion } from 'framer-motion';
import { Paperclip, SendHorizontal, ThumbsUp } from 'lucide-react';

import { EmojiPicker } from '@/shared/components/emoji-picker';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

import { cn } from '@/shared/utils';

import { useChatBottomBar } from './hooks';
import { Spinner } from '@/shared/components/spinner';

export const ChatBottomBar = () => {
  const {
    textareaRef,
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
    openImageUploadDialog,
    isUploadingImage,
  } = useChatBottomBar();

  if (!activeUser) {
    return (
      <div className="p-2 flex flex-col w-full items-center gap-2">
        <button
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          onClick={openLoginModal}
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
      <div className="p-2 flex justify-between w-full items-center gap-2">
        <div className="flex">
          <Button
            size="icon"
            variant="link"
            className="group"
            onClick={openImageUploadDialog}
            disabled={isUploadingImage}
          >
            {!isUploadingImage ? (
              <Paperclip
                size={20}
                className="text-muted-foreground group-hover:text-accent-foreground"
              />
            ) : (
              <Spinner />
            )}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative h-full"
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
              ref={textareaRef}
              autoComplete="off"
              value={message}
              onKeyDown={handleKeyPress}
              onChange={(event) => setMessage(event.target.value)}
              name="message"
              placeholder="Write a message..."
              className="w-full border flex items-center resize-none overflow-x-hidden overflow-y-auto bg-background max-h-64"
            ></Textarea>
            <div className="absolute right-2 bottom-2.5 flex gap-2">
              <EmojiPicker
                onChange={(value) => {
                  setMessage(message + value);
                  if (textareaRef.current) {
                    textareaRef.current.focus();
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
