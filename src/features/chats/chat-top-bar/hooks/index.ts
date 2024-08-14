import { useActiveGroup, useGroup } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useChatTopBar = () => {
  const { activeGroupId } = useActiveGroup();
  const { group, status } = useGroup(activeGroupId);

  const isGroupDetailsOpen = useStore((state) => state.isGroupDetailsOpen);
  const toggleGroupDetails = useStore((state) => state.toggleGroupDetails);

  return {
    group,
    status,
    isGroupDetailsOpen,
    toggleGroupDetails,
    activeGroupId,
  };
};
