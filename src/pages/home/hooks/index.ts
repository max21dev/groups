import { useActiveUser } from 'nostr-hooks';
import { useParams } from 'react-router-dom';

import { useSidebar } from '@/shared/components/sidebar/hooks';
import { useActiveGroup } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useHomePage = () => {
  const isCollapsed = useStore((state) => state.isCollapsed);
  const { isMobile } = useSidebar();

  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser();
  const { event } = useParams();

  return {
    isCollapsed,
    activeGroupId,
    activeUser,
    isMobile,
    event,
  };
};
