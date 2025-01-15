import { useActiveUser, useNip98 } from 'nostr-hooks';
import { useGroupAdmins, useGroupMembers } from 'nostr-hooks/nip29';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';
import { useActiveGroup, useActiveRelay, useLoginModalState } from '@/shared/hooks';

export const useSendContent = (
  onSend: (relay: string, groupId: string, content: string) => void,
  onAfterSend?: () => void,
) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
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
    const trimmedContent = content.trim();
    if (!trimmedContent || !activeRelay || !activeGroupId) return;

    if (!activeUser) {
      openLoginModal();
      return;
    }

    onSend(activeRelay, activeGroupId, trimmedContent);
    setContent('');
    textareaRef.current?.focus();

    if (onAfterSend) {
      onAfterSend();
    }
  }, [activeRelay, activeGroupId, content, activeUser, onSend, openLoginModal, toast]);

  const handleThumbsUp = useCallback(() => {
    if (!activeRelay || !activeGroupId) return;

    if (!activeUser) {
      openLoginModal();
      return;
    }

    onSend(activeRelay, activeGroupId, '👍');
    textareaRef.current?.focus();
  }, [activeRelay, activeGroupId, activeUser, onSend, openLoginModal]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    } else if (event.key === 'Enter' && event.shiftKey) {
      setContent((prev) => prev + '\n');
    }
  };

  const addUploadedMediaUrl = (url: string) => {
    setContent((prev) => (prev.trim() ? `${prev}\n${url}` : url));
    textareaRef.current?.focus();
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
          headers: { Authorization: token },
        }).then((res) => res.json());

        if (response.status === 'success' && response.data?.[0]?.url) {
          addUploadedMediaUrl(response.data[0].url);
        } else {
          toast({ title: 'Error', description: 'Failed to upload media', variant: 'destructive' });
        }
      } catch (e) {
        console.error(e);
        toast({ title: 'Error', description: 'Failed to upload media', variant: 'destructive' });
      } finally {
        setIsUploadingMedia(false);
      }
    };

    input.click();
  };

  useEffect(() => {
    if (!activeUser) return;

    setIsAdmin(admins?.some((admin) => admin.pubkey === activeUser.pubkey) || false);
    setIsMember(members?.some((member) => member.pubkey === activeUser.pubkey) || false);
  }, [members, admins, activeUser]);

  return {
    content,
    setContent,
    handleKeyPress,
    handleSend,
    handleThumbsUp,
    openUploadMediaDialog,
    textareaRef,
    isAdmin,
    isMember,
    isUploadingMedia,
    activeUser,
    activeRelay,
    activeGroupId,
    openLoginModal,
  };
};
