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

  const [deletedChats, setDeletedChats] = useState<string[]>([]);

  const [searchParams] = useSearchParams();

  const chatId = searchParams.get('chatId');

  const { activeGroupId } = useActiveGroup();
  const { activeRelay } = useActiveRelay();

  const { chats, chatsEvents, hasMoreChats, loadMoreChats } = useGroupChats(
    activeRelay,
    activeGroupId,
    { limit: 100 },
  );

  const { activeUser } = useActiveUser();

  const [cachedChats, setCachedChats] = useState<Nip29GroupChat[]>([]);

  const loadCachedMessages = async (groupId: string) => {
    const cached = await getGroupMessagesByGroupId(groupId);
    setCachedChats(cached);
  };

  useEffect(() => {
    if (activeGroupId) {
      loadCachedMessages(activeGroupId);
    }
  }, [activeGroupId]);

  useEffect(() => {
    if (activeGroupId && chats && chats.length > 0) {
      chats.forEach((chat) => {
        saveGroupMessage(chat, activeGroupId);
      });

      getGroupMessagesByGroupId(activeGroupId).then((cached) => {
        if (
          cached.length !== cachedChats.length ||
          (cached.length > 0 &&
            cached[cached.length - 1].id !== cachedChats[cachedChats.length - 1]?.id)
        ) {
          setCachedChats(cached);
        }
      });
    }
  }, [activeGroupId, chats]);

  const displayedChats = useMemo(() => {
    const source = cachedChats && cachedChats.length > 0 ? cachedChats : chats || [];
    return source.filter((chat) => !deletedChats.includes(chat.id));
  }, [cachedChats, chats, deletedChats]);

  const topChat = useMemo(() => displayedChats?.[0], [displayedChats]);
  const bottomChat = useMemo(() => displayedChats?.[displayedChats.length - 1], [displayedChats]);

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
  }, [displayedChats, chatId]);

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
    processedChats: displayedChats,
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
