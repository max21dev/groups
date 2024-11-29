import { useChatBottomBar } from './hooks';

import { EmojiButton } from './emoji-button';
import { InputMessage } from './input-message';
import { JoinRequestButton } from './join-request-button';
import { LoginButton } from './login-button';
import { ReplyTo } from './reply-to';
import { SendButton } from './send-button';
import { ThumbsUpButton } from './thumbs-up-button';
import { UploadImageButton } from './upload-media-button';

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
    activeGroupId,
  } = useChatBottomBar();

  if (!activeUser) {
    return <LoginButton openLoginModal={openLoginModal} />;
  }

  if (!isMember && !isAdmin) {
    return <JoinRequestButton groupId={activeGroupId} />;
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
