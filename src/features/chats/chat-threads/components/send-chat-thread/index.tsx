import { NotebookPenIcon } from 'lucide-react';
import { useState } from 'react';

import {
  InputMessage,
  MentionSuggestion,
  SendButton,
  UploadImageButton,
} from '@/features/chats/chat-bottom-bar/components';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

import { useSendChatThread } from './hooks';

export const SendChatThread = () => {
  const [isSendThreadModalOpen, setIsSendThreadModalOpen] = useState(false);
  const {
    content,
    setContent,
    handleKeyPress,
    handleSend,
    isAdmin,
    isMember,
    isCommunity,
    textareaRef,
    activeUser,
    openUploadMediaDialog,
    isUploadingMedia,
    activeGroupId,
    activeRelay,
    mentionQuery,
    handleContentChange,
    handleSelectMention,
  } = useSendChatThread(() => setIsSendThreadModalOpen(false));

  if (!activeUser || (!isCommunity && !isMember && !isAdmin)) {
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
        <DialogContent className="[&>button]:right-6 [&>button]:top-6">
          <DialogHeader>
            <DialogTitle>New Thread</DialogTitle>
          </DialogHeader>
          <div className="flex-1 relative">
            {mentionQuery !== null && (
              <MentionSuggestion
                relay={activeRelay}
                groupId={activeGroupId}
                onSelect={handleSelectMention}
                query={mentionQuery}
              />
            )}
            <div className="w-full h-full flex items-center gap-2 [&_*]:min-h-32">
              <InputMessage
                handleKeyPress={handleKeyPress}
                message={content}
                setMessage={setContent}
                textareaRef={textareaRef}
                placeholder="Share your ideas..."
                onChange={handleContentChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 [&_*]:hover:bg-transparent [&_*]:w-fit [&_*]:h-fit">
            <UploadImageButton
              isUploadingMedia={isUploadingMedia}
              openUploadMediaDialog={openUploadMediaDialog}
            />
            <SendButton handleSend={handleSend} disabled={content.trim() === ''} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
