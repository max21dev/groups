import { useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

import { useCommunity } from '@/shared/hooks';

export const useActiveGroup = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const groupId = useMemo(() => searchParams.get('groupId') || undefined, [searchParams]);
  const { isCommunity } = useCommunity(groupId);

  const setActiveGroupId = (groupId: string | undefined) => {
    if (groupId) {
      if (location.pathname === '/explore') {
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.set('groupId', groupId);
        navigate(`/?${updatedParams.toString()}`);
        return;
      }

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
