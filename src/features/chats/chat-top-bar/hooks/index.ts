import { useGroupMetadata } from 'nostr-hooks/nip29';
import { useNavigate } from 'react-router-dom';

import { useHomePage } from '@/pages/home/hooks';

import { useActiveGroup, useActiveRelay, useCopyToClipboard } from '@/shared/hooks';

import { useStore } from '@/shared/store';

export const useChatTopBar = () => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId, isCommunity } = useActiveGroup();
  const { metadata } = useGroupMetadata(activeRelay, activeGroupId);
  const { copyToClipboard, hasCopied } = useCopyToClipboard();

  const isGroupDetailsOpen = useStore((state) => state.isGroupDetailsOpen);
  const toggleGroupDetails = useStore((state) => state.toggleGroupDetails);

  const { isExploreMode } = useHomePage();
  const navigate = useNavigate();

  return {
    metadata,
    isGroupDetailsOpen,
    toggleGroupDetails,
    activeRelay,
    activeGroupId,
    isCommunity,
    copyToClipboard,
    hasCopied,
    isExploreMode,
    navigate,
  };
};
