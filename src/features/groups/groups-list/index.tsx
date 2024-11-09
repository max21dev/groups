import { useMemo, useState } from 'react';

import { GroupsListItem } from '@/features/groups';

import { useGroupsList } from './hooks';

export const GroupsList = () => {
  const { groups } = useGroupsList();

  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<Map<string, number>>(new Map());

  const sortedGroups = useMemo(
    () =>
      groups.sort((a, b) => {
        const lastMessageA = lastMessageTimestamp.get(a.id) || 0;
        const lastMessageB = lastMessageTimestamp.get(b.id) || 0;
        return lastMessageB - lastMessageA;
      }),
    [groups, lastMessageTimestamp],
  );

  return sortedGroups.map((group) => (
    <GroupsListItem
      key={group.id}
      groupId={group.id}
      setLastMessageTimestamp={setLastMessageTimestamp}
    />
  ));
};
