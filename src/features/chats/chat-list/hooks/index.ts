import { useActiveUser } from 'nostr-hooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useActiveGroup, useGlobalNdk, useGroupMessages } from '@/shared/hooks';
import { LimitFilter } from '@/shared/types';

const limitFilter: LimitFilter = { limit: 50 };

export const useChatList = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [deletedMessages, setDeletedMessages] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);

  const { globalNdk } = useGlobalNdk();
  const { activeGroupId } = useActiveGroup();
  const { messages } = useGroupMessages(activeGroupId, limitFilter);

  const { activeUser } = useActiveUser({ customNdk: globalNdk });

  const processedMessages = useMemo(
    () =>
      messages
        .filter((message) => !deletedMessages.includes(message.id))
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(-visibleCount),
    [messages, deletedMessages, visibleCount],
  );

  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;

      const isUserScrolledUp =
        container.scrollTop + container.clientHeight < container.scrollHeight - 100;

      if (!isUserScrolledUp) {
        container.scrollTop = container.scrollHeight;
      }
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

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const hasMore = messages.length > processedMessages.length;

  return {
    messagesContainerRef,
    messageRefs,
    setDeletedMessages,
    activeUser,
    processedMessages,
    scrollToMessage,
    loadMore,
    hasMore,
  };
};
