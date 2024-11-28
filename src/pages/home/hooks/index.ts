import { useActiveUser } from 'nostr-hooks';

import { useActiveGroup } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useHomePage = () => {
  const isCollapsed = useStore((state) => state.isCollapsed);

  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser();

  return {
    isCollapsed,
    activeGroupId,
    activeUser,
  };
};
