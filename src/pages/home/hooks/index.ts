import { useActiveUser } from 'nostr-hooks';
import { useMatch, useParams, useSearchParams } from 'react-router-dom';

import { useSidebar } from '@/shared/components/sidebar/hooks';
import { useActiveGroup } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useHomePage = () => {
  const isCollapsed = useStore((state) => state.isCollapsed);
  const { isMobile } = useSidebar();

  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser();
  const { event } = useParams();
  const isThreadsVisible = !!useMatch('/relay/:relay/group/:groupId/threads');

  const [searchParams] = useSearchParams();
  const isChatThread = !!searchParams.get('chatThread');

  return {
    isCollapsed,
    activeGroupId,
    activeUser,
    isMobile,
    event,
    isThreadsVisible,
    isChatThread,
  };
};
