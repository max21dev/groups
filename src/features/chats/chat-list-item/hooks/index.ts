import { useActiveUser, useNewEvent } from 'nostr-hooks';
import { useMemo } from 'react';

import { useActiveGroup, useGroupAdmin, useLoginParam, useProfile } from '@/shared/hooks';
import { useStore } from '@/shared/store';

import { ChatListItemProps } from '../types';
import { categorizeMessageContent, fetchFirstContentImage } from '../utils';

export const useChatListItem = ({
  message,
  itemIndex,
  messages,
}: Pick<ChatListItemProps, 'message' | 'itemIndex' | 'messages'>) => {
  const { openLoginModal } = useLoginParam();
  const { createNewEvent } = useNewEvent();

  const setReplyTo = useStore((state) => state.setReplyTo);

  const { activeUser } = useActiveUser();
  const { activeGroupId } = useActiveGroup();
  const { canDeleteEvent } = useGroupAdmin(activeGroupId, activeUser?.pubkey);

  const { profile } = useProfile({ pubkey: message?.authorPublicKey });

  const sameAsCurrentUser = message?.authorPublicKey === activeUser?.pubkey;

  const isLastMessage = messages.length === itemIndex + 1;
  const sameAuthorAsNextMessage =
    !isLastMessage &&
    messages[itemIndex].authorPublicKey === messages[itemIndex + 1].authorPublicKey;
  const firstMessageAuthor =
    itemIndex === 0 || messages[itemIndex - 1].authorPublicKey !== message?.authorPublicKey;
  const replyContent = messages.find((e) => e.id === message?.replyTo)?.content || '';

  const categorizedMessageContent = useMemo(
    () => categorizeMessageContent(message?.content || ''),
    [message?.content],
  );

  const firstReplyImageUrl = useMemo(() => fetchFirstContentImage(replyContent), [replyContent]);

  function deleteMessage(eventId: string, groupId: string) {
    if (!activeUser) {
      openLoginModal();
      return;
    }

    const event = createNewEvent();
    event.kind = 9005;
    event.tags = [
      ['h', groupId],
      ['e', eventId],
    ];
    event.publish();
  }

  return {
    isLastMessage,
    sameAuthorAsNextMessage,
    firstMessageAuthor,
    profile,
    deleteMessage,
    sameAsCurrentUser,
    canDeleteEvent,
    setReplyTo,
    categorizedMessageContent,
    firstReplyImageUrl,
  };
};
