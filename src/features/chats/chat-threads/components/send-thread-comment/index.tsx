import {
  EmojiButton,
  InputMessage,
  JoinRequestButton,
  LoginButton,
  SendButton,
  UploadImageButton,
} from '@/features/chats/chat-bottom-bar/components';

import { useSendThreadComment } from './hooks';

export const SendThreadComment = ({ rootId }: { rootId: string }) => {
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
    openLoginModal,
    activeGroupId,
    activeRelay,
  } = useSendThreadComment(rootId);

  if (!activeUser) {
    return (
      <div className="w-full h-full my-2 flex items-center justify-center">
        <LoginButton
          openLoginModal={openLoginModal}
          variant="outline"
          text="To add comments, please login first."
          size="sm"
        />
      </div>
    );
  }

  if (!isMember && !isAdmin) {
    return (
      <div className="w-full h-full my-2 flex items-center justify-center">
        <JoinRequestButton
          groupId={activeGroupId}
          relay={activeRelay}
          variant="outline"
          text="Join group to add comments."
          size="sm"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full my-2 flex items-center gap-1">
      <UploadImageButton
        isUploadingMedia={isUploadingMedia}
        openUploadMediaDialog={openUploadMediaDialog}
      />
      <InputMessage
        handleKeyPress={handleKeyPress}
        message={content}
        setMessage={setContent}
        textareaRef={textareaRef}
        placeholder="Add a comment..."
      />
      <EmojiButton message={content} setMessage={setContent} textareaRef={textareaRef} />
      <SendButton handleSend={handleSend} disabled={content.trim() === '' ? true : false} />
    </div>
  );
};
