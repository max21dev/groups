import {
  EmojiButton,
  InputMessage,
  JoinRequestButton,
  LoginButton,
  MentionSuggestion,
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
    isCommunity,
    mentionQuery,
    handleContentChange,
    handleSelectMention,
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

  if (!isCommunity && !isMember && !isAdmin) {
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
      <div className="flex-1 relative">
        {mentionQuery !== null && (
          <MentionSuggestion
            relay={activeRelay}
            groupId={activeGroupId}
            onSelect={handleSelectMention}
            query={mentionQuery}
          />
        )}
        <InputMessage
          handleKeyPress={handleKeyPress}
          message={content}
          setMessage={setContent}
          textareaRef={textareaRef}
          placeholder="Add a comment..."
          onChange={handleContentChange}
        />
      </div>
      <EmojiButton message={content} setMessage={setContent} textareaRef={textareaRef} />
      <SendButton handleSend={handleSend} disabled={content.trim() === ''} />
    </div>
  );
};
