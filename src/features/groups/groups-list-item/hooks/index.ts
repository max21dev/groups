import { useActiveGroup, useGroup, useGroupMessages } from '@/shared/hooks';
import { useStore } from '@/shared/store';
import { LimitFilter } from '@/shared/types';

const limitFilter: LimitFilter = { limit: 100 };

export const useGroupsListItem = ({ groupId }: { groupId: string | undefined }) => {
  const { setActiveGroupId, activeGroupId } = useActiveGroup();
  const { group } = useGroup(groupId);
  const messages = useGroupMessages(groupId, limitFilter);

  const isCollapsed = useStore((state) => state.isCollapsed);

  return {
    setActiveGroupId,
    group,
    messages,
    isCollapsed,
    activeGroupId,
  };
};
