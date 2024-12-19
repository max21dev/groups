import { useActiveUser } from 'nostr-hooks';

import { useSidebar } from '@/shared/components/sidebar/hooks';
import { useActiveGroup } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useHomePage = () => {
  const isCollapsed = useStore((state) => state.isCollapsed);
  const { isMobile } = useSidebar();

  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser();

  return {
    isCollapsed,
    activeGroupId,
    activeUser,
    isMobile,
  };
};