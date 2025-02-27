import { useActiveUser } from 'nostr-hooks';
import { useGroupAdmins, useGroupMembers } from 'nostr-hooks/nip29';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';
import {
  useActiveGroup,
  useActiveRelay,
  useBlossomUpload,
  useLoginModalState,
  useUploadMedia,
} from '@/shared/hooks';

export const useSendContent = (
  onSend: (relay: string, groupId: string, content: string) => void,
  onAfterSend?: () => void,
) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { openLoginModal } = useLoginModalState();
  const { activeGroupId } = useActiveGroup();
  const { activeRelay } = useActiveRelay();
  const { activeUser } = useActiveUser();
  const { members } = useGroupMembers(activeRelay, activeGroupId);
  const { admins } = useGroupAdmins(activeRelay, activeGroupId);
  const { toast } = useToast();
  const { isUploadingMedia, openUploadMediaDialog } = useUploadMedia(
    setContent,
    ['image/*', 'video/*'],
    textareaRef,
    true,
  );

  const { isUploading: isUploadingToBlossom, openUploadDialog: openUploadToBlossomDialog } =
    useBlossomUpload(setContent, ['image/*', 'video/*'], textareaRef, true);

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
    isUploadingToBlossom,
    openUploadToBlossomDialog,
  };
};
