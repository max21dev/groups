import { useGroupThreads } from 'nostr-hooks/nip29';

import { useActiveGroup, useActiveRelay } from '@/shared/hooks';

export const useChatThreads = () => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();
  const { isLoadingThreads, threads } = useGroupThreads(activeRelay, activeGroupId);

  return {
    isLoadingThreads,
    threads,
  };
};
