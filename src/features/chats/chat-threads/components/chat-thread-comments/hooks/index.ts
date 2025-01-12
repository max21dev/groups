import { useGroupThreadComments } from 'nostr-hooks/nip29';

import { useActiveGroup, useActiveRelay } from '@/shared/hooks';

export const useChatThreadComments = (parentId: string) => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();

  const { threadComments, isLoadingThreadComments, hasMoreThreadComments, loadMoreThreadComments } =
    useGroupThreadComments(activeRelay, activeGroupId, {
      byParentId: { parentId, waitForParentId: true },
    });

  return { threadComments, isLoadingThreadComments, hasMoreThreadComments, loadMoreThreadComments };
};
