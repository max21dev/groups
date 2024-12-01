import { useChatBottomBar } from './hooks';

import {
  EmojiButton,
  InputMessage,
  JoinRequestButton,
  LoginButton,
  ReplyTo,
  SendButton,
  ThumbsUpButton,
  UploadImageButton,
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
        <UploadImageButton
          isUploadingMedia={isUploadingMedia}
          openUploadMediaDialog={openUploadMediaDialog}
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
