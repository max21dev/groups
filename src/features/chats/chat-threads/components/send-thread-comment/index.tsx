import { MessageSquareTextIcon } from 'lucide-react';
import { useState } from 'react';

import {
  InputMessage,
  SendButton,
  UploadImageButton,
} from '@/features/chats/chat-bottom-bar/components';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

import { useSendThreadComment } from './hooks';

export const SendThreadComment = ({ rootId }: { rootId: string }) => {
  const [isSendCommentModalOpen, setIsSendCommentModalOpen] = useState(false);
  const {
    content,
    setContent,
    handleKeyPress,
    handleSend,
    isAdmin,
    isMember,
    textareaRef,
    activeUser,
    openUploadMediaDialog,
    isUploadingMedia,
  } = useSendThreadComment(rootId, () => setIsSendCommentModalOpen(false));

  if (!activeUser || (!isMember && !isAdmin)) {
    return null;
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="flex justify-center items-center gap-1 self-stretch"
        onClick={() => setIsSendCommentModalOpen(true)}
      >
        <MessageSquareTextIcon size={17} />
        Add Comment
      </Button>

      <Dialog open={isSendCommentModalOpen} onOpenChange={() => setIsSendCommentModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Comment</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full flex items-center gap-2 [&_*]:min-h-32">
            <InputMessage
              handleKeyPress={handleKeyPress}
              message={content}
              setMessage={setContent}
              textareaRef={textareaRef}
              placeholder="Add a comment..."
            />
          </div>
          <div className="flex justify-end gap-1">
            <UploadImageButton
              isUploadingMedia={isUploadingMedia}
              openUploadMediaDialog={openUploadMediaDialog}
            />
            <SendButton handleSend={handleSend} disabled={content.trim() === '' ? true : false} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
