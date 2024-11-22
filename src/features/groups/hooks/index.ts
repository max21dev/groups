import { useGroups } from '@/shared/hooks';
import { useMemo, useState } from 'react';

export const useGroupsList = () => {
  const { groups } = useGroups();

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
  return { groups , sortedGroups, setLastMessageTimestamp };
};
