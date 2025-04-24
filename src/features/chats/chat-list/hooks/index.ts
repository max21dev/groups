import { useActiveUser } from 'nostr-hooks';
import {
  Nip29GroupChat,
  useGroupChats,
  useGroupJoinRequests,
  useGroupLeaveRequests,
} from 'nostr-hooks/nip29';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useActiveGroup, useActiveRelay } from '@/shared/hooks';
import { getGroupMessagesByGroupId, saveGroupMessage } from '@/shared/lib/db/groupCache';

export const useChatList = () => {
  const chatsContainerRef = useRef<HTMLDivElement>(null);
  const chatRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [isLoadingCachedMessages, setIsLoadingCachedMessages] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<Nip29GroupChat[]>([]);
  const [deletedChats, setDeletedChats] = useState<string[]>([]);

  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('chatId');

  const { activeGroupId } = useActiveGroup();
  const { activeRelay } = useActiveRelay();
  const { activeUser } = useActiveUser();

  const { chats, chatsEvents, hasMoreChats, loadMoreChats } = useGroupChats(
    activeRelay,
    activeGroupId,
    { limit: 100 },
  );

  useEffect(() => {
    if (activeGroupId) {
      setIsLoadingCachedMessages(true);

      getGroupMessagesByGroupId(activeGroupId)
        .then((cached) => {
          if (cached.length > 0) {
            setDisplayedMessages(cached);
          } else {
            setDisplayedMessages([]);
          }
        })
        .finally(() => {
          setIsLoadingCachedMessages(false);
        });
    }
  }, [activeGroupId]);

  useEffect(() => {
    if (!activeGroupId || !chats || chats.length === 0 || isLoadingCachedMessages) return;

    const savePromises = chats.map((chat) => saveGroupMessage(chat, activeGroupId));

    Promise.all(savePromises).then(() => {
      const existingIds = new Set(displayedMessages.map((msg) => msg.id));
      const newMessages = chats.filter((chat) => !existingIds.has(chat.id));

      if (newMessages.length > 0) {
        const mergedMessages = [...displayedMessages, ...newMessages].sort(
          (a, b) => a.timestamp - b.timestamp,
        );

        setDisplayedMessages(mergedMessages);
      }
    });
  }, [activeGroupId, chats, isLoadingCachedMessages, displayedMessages]);

  const processedChats = useMemo(() => {
    return displayedMessages.filter((chat) => !deletedChats.includes(chat.id));
  }, [displayedMessages, deletedChats]);

  const topChat = useMemo(() => processedChats[0], [processedChats]);
  const bottomChat = useMemo(() => processedChats[processedChats.length - 1], [processedChats]);

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

  const filteredJoinRequests = useMemo(() => {
    if (!joinRequests || !topChat) return [];
    return joinRequests.filter((req) => req.timestamp >= topChat.timestamp);
  }, [joinRequests, topChat]);

  const filteredLeaveRequests = useMemo(() => {
    if (!leaveRequests || !topChat) return [];
    return leaveRequests.filter((req) => req.timestamp >= topChat.timestamp);
  }, [leaveRequests, topChat]);

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
    joinRequests: filteredJoinRequests,
    leaveRequests: filteredLeaveRequests,
  };
};
