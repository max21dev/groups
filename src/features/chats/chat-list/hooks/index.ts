import { useActiveUser } from 'nostr-hooks';
import { useGroupChats, useGroupJoinRequests, useGroupLeaveRequests } from 'nostr-hooks/nip29';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useActiveGroup, useActiveRelay } from '@/shared/hooks';

export const useChatList = () => {
  const chatsContainerRef = useRef<HTMLDivElement>(null);
  const chatRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [deletedChats, setDeletedChats] = useState<string[]>([]);

  const { chatId } = useParams();

  const { activeGroupId } = useActiveGroup();
  const { activeRelay } = useActiveRelay();

  const { chats, chatsEvents, hasMoreChats, loadMoreChats } = useGroupChats(
    activeRelay,
    activeGroupId,
    { limit: 100 },
  );

  const { activeUser } = useActiveUser();

  const processedChats = useMemo(
    () => chats?.filter((chat) => !deletedChats.includes(chat.id)),
    [chats, deletedChats],
  );

  const topChat = useMemo(() => processedChats?.[0], [processedChats]);
  const bottomChat = useMemo(() => processedChats?.[processedChats.length - 1], [processedChats]);

  useEffect(() => {
    if (chatsContainerRef.current) {
      const container = chatsContainerRef.current;

      const isUserScrolledUp =
        container.scrollTop + container.clientHeight < container.scrollHeight - 100;

      if (!isUserScrolledUp) {
        container.scrollTop = container.scrollHeight;
      }
    }

    if (chatId) {
      scrollToChat(chatId);
    }
  }, [processedChats, chatId]);

  const scrollToChat = (chatId: string) => {
    const chatElement = chatRefs.current[chatId];
    if (chatElement && chatsContainerRef.current) {
      chatsContainerRef.current.scrollTo({
        top: chatElement.offsetTop - chatsContainerRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const { joinRequests } = useGroupJoinRequests(activeRelay, activeGroupId);
  const { leaveRequests } = useGroupLeaveRequests(activeRelay, activeGroupId);

  return {
    chatsContainerRef,
    chatRefs,
    setDeletedChats,
    activeUser,
    processedChats,
    chatsEvents,
    scrollToChat,
    loadMore: loadMoreChats,
    hasMore: hasMoreChats,
    topChat,
    bottomChat,
    joinRequests,
    leaveRequests,
  };
};
