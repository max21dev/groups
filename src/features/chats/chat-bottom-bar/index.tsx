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
    sendJoinRequest,
    activeUser,
    messages,
    openUploadMediaDialog,
    isUploadingMedia,
    openLoginModal,
  } = useChatBottomBar();

  if (!activeUser) {
    return <LoginButton openLoginModal={openLoginModal} />;
  }

  if (!isMember && !isAdmin) {
    return <JoinRequestButton sendJoinRequest={sendJoinRequest} />;
  }

  return (
    <>
      <ReplyTo setReplyTo={setReplyTo} messages={messages} replyTo={replyTo} />

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
