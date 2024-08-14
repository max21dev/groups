import { GroupsListItem } from '@/features/groups';

import { useGroupsList } from './hooks';

export const GroupsList = () => {
  const { groups } = useGroupsList();

  return groups.map((group) => <GroupsListItem key={group.id} groupId={group.id} />);
};
