import { PinIcon } from 'lucide-react';

import { useGroupMetadata } from 'nostr-hooks/nip29';
import { Link } from 'react-router-dom';

import { GroupAvatar, GroupsListMenu } from '@/features/groups';
import { UserAvatar, UserName } from '@/features/users';

import { useHomePage } from '@/pages/home/hooks';

import { useActiveGroup, useCommunity } from '@/shared/hooks';
import { cn, ellipsis } from '@/shared/utils';

export const PinnedListItem = ({ relay, groupId }: { relay: string; groupId: string }) => {
  const { metadata } = useGroupMetadata(relay, groupId);
  const { activeGroupId } = useActiveGroup();
  const { isCollapsed, isMobile } = useHomePage();

  const { isCommunity } = useCommunity(groupId, relay);

  return (
    <GroupsListMenu groupId={groupId}>
      <Link
        className={cn(
          'flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent',
          groupId === activeGroupId && 'bg-accent',
          isCollapsed && !isMobile && 'justify-center',
        )}
        to={`/?relay=${relay}&groupId=${groupId}`}
      >
        {isCommunity ? (
          <UserAvatar pubkey={groupId} />
        ) : (
          <GroupAvatar relay={relay} groupId={groupId} />
        )}
        {(!isCollapsed || isMobile) && (
          <>
            <div className="flex flex-col gap-1">
              {isCommunity ? (
                <span className="flex items-center gap-1">
                  <UserName pubkey={groupId} className="text-sm font-semibold" length={20} />
                  (c)
                </span>
              ) : (
                <p className="text-sm font-semibold truncate">
                  {metadata?.name || ellipsis(groupId, 7)}
                </p>
              )}
              <p className="text-xs truncate text-muted-foreground">
                {relay.replace('wss://', '')}
              </p>
            </div>
            <PinIcon size={15} className="ms-auto rotate-45 text-muted-foreground" />
          </>
        )}
      </Link>
    </GroupsListMenu>
  );
};
