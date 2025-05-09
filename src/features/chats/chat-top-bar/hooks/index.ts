import { useGroupMetadata } from 'nostr-hooks/nip29';

import { useActiveGroup, useActiveRelay, useCopyToClipboard } from '@/shared/hooks';

import { useStore } from '@/shared/store';

export const useChatTopBar = () => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId, setActiveGroupId, isCommunity } = useActiveGroup();
  const { metadata } = useGroupMetadata(activeRelay, activeGroupId);
  const { copyToClipboard, hasCopied } = useCopyToClipboard();

  const isGroupDetailsOpen = useStore((state) => state.isGroupDetailsOpen);
  const toggleGroupDetails = useStore((state) => state.toggleGroupDetails);

  return {
    metadata,
    isGroupDetailsOpen,
    toggleGroupDetails,
    activeRelay,
    activeGroupId,
    setActiveGroupId,
    isCommunity,
    copyToClipboard,
    hasCopied,
  };
};
