import { useChatBottomBar } from './hooks';

import {
  EmojiButton,
  InputMessage,
  JoinRequestButton,
  LoginButton,
  MentionSuggestion,
  ReplyTo,
  SendButton,
  ThumbsUpButton,
  UploadMediaMenu,
} from './components';

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
    activeUser,
    chats,
    openUploadMediaDialog,
    isUploadingMedia,
    openLoginModal,
    activeRelay,
    activeGroupId,
    isCommunity,
    isUploadingToBlossom,
    openUploadToBlossomDialog,
    mentionQuery,
    handleContentChange,
    handleSelectMention,
  } = useChatBottomBar();

  if (!activeUser) {
    return <LoginButton openLoginModal={openLoginModal} />;
  }

  if (!isCommunity && !isMember && !isAdmin) {
    return <JoinRequestButton relay={activeRelay} groupId={activeGroupId} />;
  }

  return (
    <>
      <ReplyTo setReplyTo={setReplyTo} chats={chats} replyTo={replyTo} />

      <div className="w-full h-full flex items-center gap-2">
        <UploadMediaMenu
          isUploadingMedia={isUploadingMedia}
          openUploadMediaDialog={openUploadMediaDialog}
          isUploadingToBlossom={isUploadingToBlossom}
          openUploadToBlossomDialog={openUploadToBlossomDialog}
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
            message={message}
            setMessage={setMessage}
            textareaRef={textareaRef}
            onChange={handleContentChange}
          />
        </div>

        <EmojiButton message={message} setMessage={setMessage} textareaRef={textareaRef} />

        {message.trim() ? (
          <SendButton handleSend={handleSend} />
        ) : (
          <ThumbsUpButton handleThumbsUp={handleThumbsUp} />
        )}
      </div>
    </>
  );
};
