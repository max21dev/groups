import { NotebookPenIcon } from 'lucide-react';
import { useState } from 'react';

import {
  InputMessage,
  SendButton,
  UploadImageButton,
} from '@/features/chats/chat-bottom-bar/components';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

import { useSendChatThread } from './hooks';

export const SendChatThread = () => {
  const [isSendThreadModalOpen, setIsSendThreadModalOpen] = useState(false);
  const {
    thread,
    setThread,
    handleKeyPress,
    handleSend,
    isAdmin,
    isMember,
    textareaRef,
    activeUser,
    openUploadMediaDialog,
    isUploadingMedia,
  } = useSendChatThread();

  if (!activeUser || (!isMember && !isAdmin)) {
    return null;
  }

  return (
    <div>
      <Button
        variant="outline"
        className="flex justify-center items-center gap-1 self-stretch"
        onClick={() => setIsSendThreadModalOpen(true)}
      >
        <NotebookPenIcon size={17} />
        Add New Thread
      </Button>

      <Dialog open={isSendThreadModalOpen} onOpenChange={() => setIsSendThreadModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Thread</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full flex items-center gap-2 [&_*]:min-h-32">
            <InputMessage
              handleKeyPress={handleKeyPress}
              message={thread}
              setMessage={setThread}
              textareaRef={textareaRef}
              placeholder="Share your ideas..."
            />
          </div>
          <div className="flex justify-end gap-1">
            <UploadImageButton
              isUploadingMedia={isUploadingMedia}
              openUploadMediaDialog={openUploadMediaDialog}
            />
            <SendButton handleSend={handleSend} disabled={thread.trim() === '' ? true : false} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
