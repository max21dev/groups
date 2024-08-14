import { useActiveUser, useNewEvent } from 'nostr-hooks';
import React, { useEffect, useRef, useState } from 'react';

import {
  useActiveGroup,
  useGroupAdmins,
  useGroupMembers,
  useGroupMessages,
  useLoginParam,
} from '@/shared/hooks';
import { useStore } from '@/shared/store';
import { GroupMessage, LimitFilter } from '@/shared/types';

const limitFilter: LimitFilter = { limit: 100 };

export const useChatBottomBar = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const replyTo = useStore((state) => state.replyTo);
  const setReplyTo = useStore((state) => state.setReplyTo);

  const { activeGroupId } = useActiveGroup();
  const { members } = useGroupMembers(activeGroupId);
  const { admins } = useGroupAdmins(activeGroupId);
  const { activeUser } = useActiveUser();
  const messages = useGroupMessages(activeGroupId, limitFilter);

  const { openLoginModal } = useLoginParam();
  const { createNewEvent } = useNewEvent();

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

      if (inputRef.current) {
        inputRef.current.focus();
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

  const sendMessage = (message: string, replyTo?: GroupMessage) => {
    if (!activeGroupId || !message) return;

    if (!activeUser) {
      openLoginModal();
      return;
    }

    const event = createNewEvent();
    event.kind = replyTo ? 12 : 11;
    event.content = message;
    event.tags = [
      ['h', activeGroupId],
      ...(replyTo?.id ? [['e', replyTo.id, '', 'reaction']] : []),
    ];
    event.publish();
  };

  const sendJoinRequest = () => {
    if (!activeUser) {
      openLoginModal();
      return;
    }

    if (!activeGroupId) return;

    const event = createNewEvent();
    event.kind = 9021;
    event.tags = [['h', activeGroupId]];
    event.publish();
    //TODO: check if join request was successful
  };

  useEffect(() => {
    if (!activeUser) return;

    setIsAdmin(admins.some((admin) => admin.publicKey === activeUser.pubkey));
    setIsMember(members.some((member) => member.publicKey === activeUser.pubkey));
  }, [members, admins, activeUser]);

  return {
    message,
    setMessage,
    handleKeyPress,
    handleSend,
    handleThumbsUp,
    sendJoinRequest,
    isAdmin,
    isMember,
    replyTo,
    setReplyTo,
    inputRef,
    messages,
    activeUser,
    openLoginModal,
  };
};
