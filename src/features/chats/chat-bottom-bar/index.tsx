import { useChatBottomBar } from './hooks';

import {
  EmojiButton,
  InputMessage,
  JoinRequestButton,
  LoginButton,
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
    isUploadingToBlossom,
    openUploadToBlossomDialog,
  } = useChatBottomBar();

  if (!activeUser) {
    return <LoginButton openLoginModal={openLoginModal} />;
  }

  if (!isMember && !isAdmin) {
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

        <InputMessage
          handleKeyPress={handleKeyPress}
          message={message}
          setMessage={setMessage}
          textareaRef={textareaRef}
        />

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
