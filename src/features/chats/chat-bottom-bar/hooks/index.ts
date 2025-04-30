import { sendGroupChat, useGroupChats } from 'nostr-hooks/nip29';

import { useToast } from '@/shared/components/ui/use-toast';
import { useSendContent } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useChatBottomBar = () => {
  const { toast } = useToast();

  const replyTo = useStore((state) => state.replyTo);
  const setReplyTo = useStore((state) => state.setReplyTo);

  const {
    content: message,
    setContent: setMessage,
    handleKeyPress,
    handleSend,
    handleThumbsUp,
    openUploadMediaDialog,
    textareaRef,
    isUploadingMedia,
    activeUser,
    activeGroupId,
    isCommunity,
    activeRelay,
    openLoginModal,
    isMember,
    isAdmin,
    isUploadingToBlossom,
    openUploadToBlossomDialog,
    mentionQuery,
    handleContentChange,
    handleSelectMention,
  } = useSendContent((relay, groupId, content) => {
    sendGroupChat({
      relay,
      groupId,
      chat: {
        content,
        parentId: replyTo,
      },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
      },
    });

    setReplyTo(undefined);
  });

  const { chats } = useGroupChats(activeRelay, activeGroupId);

  return {
    message,
    setMessage,
    handleKeyPress,
    handleSend,
    handleThumbsUp,
    isAdmin,
    isMember,
    replyTo,
    setReplyTo,
    textareaRef,
    chats,
    activeUser,
    openLoginModal,
    openUploadMediaDialog,
    isUploadingMedia,
    activeRelay,
    activeGroupId,
    isCommunity,
    isUploadingToBlossom,
    openUploadToBlossomDialog,
    mentionQuery,
    handleContentChange,
    handleSelectMention,
  };
};
