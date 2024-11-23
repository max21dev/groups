import { GroupWidget } from '@/features/groups';
import { useGroupsList } from '@/features/groups/hooks';

export const GroupsListWidget = () => {
  const { sortedGroups } = useGroupsList();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 m-4 overflow-x-auto">
      {sortedGroups && sortedGroups.map((group) => <GroupWidget key={group.id} group={group} />)}
    </div>
  );
};