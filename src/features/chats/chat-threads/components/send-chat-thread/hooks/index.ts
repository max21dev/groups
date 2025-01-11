import { useActiveUser, useNip98 } from 'nostr-hooks';
import { sendGroupThread, useGroupAdmins, useGroupMembers } from 'nostr-hooks/nip29';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';
import { useActiveGroup, useActiveRelay, useLoginModalState } from '@/shared/hooks';

export const useSendChatThread = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [thread, setThread] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const { openLoginModal } = useLoginModalState();

  const { activeGroupId } = useActiveGroup();
  const { activeRelay } = useActiveRelay();

  const { activeUser } = useActiveUser();
  const { getToken } = useNip98();

  const { members } = useGroupMembers(activeRelay, activeGroupId);
  const { admins } = useGroupAdmins(activeRelay, activeGroupId);

  const { toast } = useToast();

  const handleSend = useCallback(() => {
    const threadContent = thread.trim();
    if (!threadContent || !activeGroupId || !activeRelay) return;

    if (!activeUser) {
      openLoginModal();
      return;
    }

    sendGroupThread({
      relay: activeRelay,
      groupId: activeGroupId,
      thread: { content: threadContent, subject: '' },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to send thread', variant: 'destructive' });
      },
    });

    setThread('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [thread, activeGroupId, activeRelay, activeUser, openLoginModal, toast]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      setThread((prev) => prev + '\n');
    }
  };

  const addUploadedMediaUrlToThread = (url: string) => {
    setThread((prev) => {
      if (prev.trim().length === 0) {
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

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('fileToUpload', file);

      setIsUploadingMedia(true);

      const token = await getToken({
        url: import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT,
        method: 'POST',
      });

      if (!token) {
        toast({ title: 'Error', description: 'Failed to upload media', variant: 'destructive' });
        setIsUploadingMedia(false);
        return;
      }

      try {
        const response = await fetch(import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: token,
          },
        }).then((res) => res.json());

        if (response.status === 'success' && response.data?.[0]?.url) {
          addUploadedMediaUrlToThread(response.data[0].url);
        } else {
          handleUploadError(response.status);
        }
      } catch (e) {
        handleUploadError(e);
      } finally {
        setIsUploadingMedia(false);
      }
    };

    input.click();
  };

  useEffect(() => {
    if (!activeUser) return;

    admins && setIsAdmin(admins.some((admin) => admin.pubkey === activeUser.pubkey));
    members && setIsMember(members.some((member) => member.pubkey === activeUser.pubkey));
  }, [members, admins, activeUser]);

  return {
    thread,
    setThread,
    handleKeyPress,
    handleSend,
    isAdmin,
    isMember,
    textareaRef,
    activeUser,
    openUploadMediaDialog,
    isUploadingMedia,
  };
};
