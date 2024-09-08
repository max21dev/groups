import { useActiveUser } from 'nostr-hooks';

import { useActiveGroup, useGlobalNdk } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useHomePage = () => {
  const isCollapsed = useStore((state) => state.isCollapsed);

  const { globalNdk } = useGlobalNdk();

  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser({ customNdk: globalNdk });

  return {
    isCollapsed,
    activeGroupId,
    activeUser,
  };
};
