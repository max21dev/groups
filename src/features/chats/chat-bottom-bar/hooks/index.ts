import { useActiveUser } from 'nostr-hooks';
import { sendGroupChat, useGroupAdmins, useGroupChats, useGroupMembers } from 'nostr-hooks/nip29';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

import { useActiveGroup, useActiveRelay, useLoginModalState } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useChatBottomBar = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploadingMedia, setisUploadingMedia] = useState(false);

  const replyTo = useStore((state) => state.replyTo);
  const setReplyTo = useStore((state) => state.setReplyTo);

  const { openLoginModal } = useLoginModalState();

  const { activeGroupId } = useActiveGroup();
  const { activeRelay } = useActiveRelay();

  const { activeUser } = useActiveUser();

  const { members } = useGroupMembers(activeRelay, activeGroupId);
  const { admins } = useGroupAdmins(activeRelay, activeGroupId);
  const { chats } = useGroupChats(activeRelay, activeGroupId);

  const { toast } = useToast();

  const handleThumbsUp = () => {
    sendMessage('👍', replyTo);
    setMessage('');
  };

  const handleSend = () => {
    const messageToSend = message.trim();
    if (messageToSend) {
      sendMessage(messageToSend, replyTo);
      setMessage('');
      setReplyTo(undefined);

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + '\n');
    }
  };

  const sendMessage = useCallback(
    (message: string, replyTo?: string) => {
      if (!activeGroupId || !message) return;

      if (!activeUser) {
        openLoginModal();
        return;
      }

      sendGroupChat({
        groupId: activeGroupId,
        chat: {
          content: message,
          parentId: replyTo,
        },
        onError: () => {
          toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
        },
      });
    },
    [activeGroupId, activeUser, openLoginModal, toast],
  );

  const addUploadedMediaUrlToMessage = (url: string) => {
    setMessage((prev) => {
      if (prev.trim().length == 0) {
        return url;
      }

      return `${prev}\n${url}`;
    });

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleUploadError = (e: unknown) => {
    console.error(e);
    toast({ title: 'Error', description: 'Failed to upload media file', variant: 'destructive' });
  };

  const openUploadMediaDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('fileToUpload', file);

      setisUploadingMedia(true);

      fetch(import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(({ status, data }) => {
          if (status === 'success' && data?.[0]?.url) {
            addUploadedMediaUrlToMessage(data[0].url);
          } else {
            handleUploadError(status);
          }
        })
        .catch((e) => {
          handleUploadError(e);
        })
        .finally(() => {
          setisUploadingMedia(false);
        });
    };

    input.click();
  };

  useEffect(() => {
    if (!activeUser) return;

    admins && setIsAdmin(admins.some((admin) => admin.pubkey === activeUser.pubkey));
    members && setIsMember(members.some((member) => member.pubkey === activeUser.pubkey));
  }, [members, admins, activeUser]);

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
    activeGroupId,
  };
};
