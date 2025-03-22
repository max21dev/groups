import { useProfile } from 'nostr-hooks';
import { useGroupChats } from 'nostr-hooks/nip29';
import { useMemo } from 'react';

import { useActiveGroup, useActiveRelay, useLazyLoad } from '@/shared/hooks';

import { fetchFirstContentImage } from '../utils';

export const useChatReply = (replyId: string) => {
  const { ref: replyRef, hasEnteredViewport } = useLazyLoad<HTMLDivElement>();

  const { activeGroupId } = useActiveGroup();
  const { activeRelay } = useActiveRelay();
  const { chats, isLoadingChats } = useGroupChats(
    hasEnteredViewport ? activeRelay : undefined,
    hasEnteredViewport ? activeGroupId : undefined,
    hasEnteredViewport
      ? {
          byId: { id: replyId, waitForId: true },
        }
      : undefined,
  );

  const reply = chats?.[0];

  const { profile: replyAuthorProfile } = useProfile({ pubkey: reply?.pubkey });

  const firstReplyImageUrl = useMemo(
    () => fetchFirstContentImage(reply?.content || ''),
    [reply?.content],
  );

  return {
    reply,
    replyAuthorProfile,
    firstReplyImageUrl,
    isLoadingChats,
    replyRef,
    hasEnteredViewport,
  };
};
