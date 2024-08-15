import { useActiveUser } from 'nostr-hooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useActiveGroup, useGroupMessages } from '@/shared/hooks';
import { LimitFilter } from '@/shared/types';

const limitFilter: LimitFilter = { limit: 200 };

export const useChatList = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [deletedMessages, setDeletedMessages] = useState<string[]>([]);

  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser();

  const messages = useGroupMessages(activeGroupId, limitFilter);

  const processedMessages = useMemo(
    () =>
      messages
        .filter((message) => !deletedMessages.includes(message.id))
        .sort((a, b) => a.createdAt - b.createdAt),
    [messages, deletedMessages],
  );

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [processedMessages]);

  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messageElement.offsetTop - messagesContainerRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return {
    messagesContainerRef,
    messageRefs,
    setDeletedMessages,
    activeUser,
    processedMessages,
    scrollToMessage,
  };
};
