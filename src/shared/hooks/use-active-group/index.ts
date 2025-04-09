import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCommunity } from '@/shared/hooks';

export const useActiveGroup = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const groupId = useMemo(() => searchParams.get('groupId') || undefined, [searchParams]);
  const { isCommunity } = useCommunity(groupId);

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

  return { activeGroupId: groupId, setActiveGroupId, isCommunity };
};
