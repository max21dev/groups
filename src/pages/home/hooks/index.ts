import { useActiveUser } from 'nostr-hooks';
import { useMatch, useSearchParams } from 'react-router-dom';

import { useSidebar } from '@/shared/components/sidebar/hooks';

import { useActiveGroup, useActiveRelay } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useHomePage = () => {
  const isCollapsed = useStore((state) => state.isCollapsed);
  const { isMobile } = useSidebar();

  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();

  const { activeUser } = useActiveUser();
  const isWalletsVisible = !!useMatch('/wallets/*');

  const [searchParams] = useSearchParams();
  const event = searchParams.get('eventId');

  return {
    isCollapsed,
    activeRelay,
    activeGroupId,
    activeUser,
    isMobile,
    event,
    isWalletsVisible,
  };
};
