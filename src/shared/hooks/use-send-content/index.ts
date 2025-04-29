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
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionPosition, setMentionPosition] = useState<number | null>(null);

  const { openLoginModal } = useLoginModalState();
  const { activeGroupId, isCommunity } = useActiveGroup();
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

  const handleMention = (text: string, position: number) => {
    const textBeforeCursor = text.substring(0, position);
    const mentionMatch = textBeforeCursor.match(/@([^@\s]*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1] || '');
      setMentionPosition(position - (mentionMatch[1]?.length || 0) - 1);
    } else {
      setMentionQuery(null);
      setMentionPosition(null);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    setContent(newValue);
    handleMention(newValue, cursorPosition);
  };

  const handleSelectMention = (mention: string) => {
    if (mentionPosition !== null) {
      const before = content.substring(0, mentionPosition);
      const after = content.substring(mentionPosition + (mentionQuery?.length || 0) + 1);
      const newContent = `${before}${mention} ${after}`;
      setContent(newContent);

      const newCursorPosition = mentionPosition + mention.length + 1;
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPosition;
          textareaRef.current.selectionEnd = newCursorPosition;
          textareaRef.current.focus();
        }
      }, 0);
    }
    setMentionQuery(null);
    setMentionPosition(null);
  };

  const handleSend = useCallback(() => {
    const trimmedContent = content.trim();
    if (!trimmedContent || !activeRelay || !activeGroupId) return;

    if (!activeUser) {
      openLoginModal();
      return;
    }

    onSend(activeRelay, activeGroupId, trimmedContent);
    setContent('');
    setMentionQuery(null);
    setMentionPosition(null);
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
    isCommunity,
    openLoginModal,
    isUploadingToBlossom,
    openUploadToBlossomDialog,
    mentionQuery,
    handleContentChange,
    handleSelectMention,
  };
};
