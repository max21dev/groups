import { useActiveUser, useProfile } from 'nostr-hooks';
import {
  deleteGroupEvent,
  Nip29GroupChat,
  Nip29GroupReaction,
  sendGroupReaction,
  useGroupReactions,
} from 'nostr-hooks/nip29';
import { useCallback, useMemo } from 'react';

import { useJoinRequestButton } from '@/features/chats/chat-bottom-bar/components/join-request-button/hooks';
import { useChatBottomBar } from '@/features/chats/chat-bottom-bar/hooks';

import { useToast } from '@/shared/components/ui/use-toast';

import { useActiveGroup, useActiveRelay, useZapModalState } from '@/shared/hooks';

import { useStore } from '@/shared/store';

import { ChatListItemProps } from '../types';
import { categorizeChatContent, fetchFirstContentImage } from '../utils';

export const useChatListItem = ({
  chat,
  topChat,
  bottomChat,
  nextChat,
  chats,
  setDeletedChats,
  chatsEvents,
}: Partial<ChatListItemProps>) => {
  const setReplyTo = useStore((state) => state.setReplyTo);

  const { setZapTarget, openZapModal } = useZapModalState();

  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();

  const { activeUser } = useActiveUser();

  const { reactions } = useGroupReactions(activeRelay, activeGroupId, {
    byTargetId: { targetId: chat?.id, waitForTargetId: true },
  });

  const { profile } = useProfile({ pubkey: chat?.pubkey });

  const { isAdmin, isMember } = useChatBottomBar();
  const { sendJoinRequest } = useJoinRequestButton(activeRelay, activeGroupId);

  const categorizedReactions = useMemo(() => {
    return reactions?.reduce(
      (acc, reaction) => {
        acc[reaction.content] = acc[reaction.content] || [];
        acc[reaction.content].push(reaction);
        return acc;
      },

      {} as Record<string, Nip29GroupReaction[]>,
    );
  }, [reactions]);

  const sameAsCurrentUser = chat?.pubkey === activeUser?.pubkey;

  const isLastChat = chat?.id === bottomChat?.id;

  const sameAuthorAsNextChat = chats && chat && nextChat && chat.pubkey === nextChat.pubkey;

  const topChatAuthor = topChat?.pubkey;

  const categorizedChatContent = useMemo(
    () => categorizeChatContent(chat?.content || ''),
    [chat?.content],
  );

  // TODO: refactor replies to new component
  const reply = chats?.find((e) => e.id === chat?.parentId);

  const { profile: replyAuthorProfile } = useProfile({ pubkey: reply?.pubkey });

  const firstReplyImageUrl = useMemo(
    () => fetchFirstContentImage(reply?.content || ''),
    [reply?.content],
  );

  const { toast } = useToast();

  const sendReaction = useCallback(
    (content: string, targetId: string) => {
      if (!activeGroupId || !activeRelay) return;

      if (!isAdmin && !isMember) {
        sendJoinRequest();
      }

      sendGroupReaction({
        relay: activeRelay,
        groupId: activeGroupId,
        reaction: { content, targetId },
        onError: () => {
          toast({ title: 'Error', description: 'Failed to send reaction', variant: 'destructive' });
        },
      });
    },
    [activeGroupId, activeRelay, isAdmin, isMember, sendJoinRequest, toast],
  );

  const deleteChat = useCallback(
    (chat: Nip29GroupChat) => {
      if (chat.pubkey === activeUser?.pubkey) {
        chatsEvents
          ?.find((e) => e.id === chat.id)
          ?.delete()
          .then(() => {
            setDeletedChats?.((prev) => [...prev, chat.id]);
          })
          .catch(() => {
            toast({ title: 'Error', description: 'Failed to delete chat', variant: 'destructive' });
          });
      } else {
        activeGroupId &&
          activeRelay &&
          deleteGroupEvent({
            relay: activeRelay,
            groupId: activeGroupId,
            eventId: chat.id,
            onSuccess: () => {
              setDeletedChats?.((prev) => [...prev, chat.id]);
            },
            onError() {
              toast({
                title: 'Error',
                description: 'Failed to delete chat',
                variant: 'destructive',
              });
            },
          });
      }
    },
    [activeUser, activeGroupId, activeRelay, chatsEvents, setDeletedChats, toast],
  );

  return {
    isLastChat,
    sameAuthorAsNextChat,
    topChatAuthor,
    profile,
    deleteChat,
    sameAsCurrentUser,
    setReplyTo,
    categorizedChatContent,
    firstReplyImageUrl,
    replyAuthorProfile,
    reply,
    setZapTarget,
    openZapModal,
    activeUser,
    sendReaction,
    categorizedReactions,
  };
};
