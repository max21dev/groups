import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useActiveGroup = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const groupId = useMemo(() => searchParams.get('groupId') || undefined, [searchParams]);

  const setActiveGroupId = (groupId: string | undefined) => {
    if (groupId) {
      setSearchParams((prev) => {
        const updatedParams = new URLSearchParams(prev);
        updatedParams.set('groupId', groupId);
        return updatedParams;
      });
    } else {
      setSearchParams((prev) => {
        const updatedParams = new URLSearchParams(prev);
        updatedParams.delete('groupId');
        return updatedParams;
      });
    }
  };

  return { activeGroupId: groupId, setActiveGroupId };
};
