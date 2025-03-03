import { useGroupChats, useGroupMetadata } from 'nostr-hooks/nip29';

import { GroupAvatar } from '@/features/groups';
import { UserAvatar } from '@/features/users';

import { Badge } from '@/shared/components/ui/badge.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { useActiveGroup, useActiveRelay, useLazyLoad } from '@/shared/hooks';

import { displayTime, ellipsis } from '@/shared/utils';

export const GroupWidget = ({ groupId }: { groupId: string }) => {
  const { ref: cardRef, hasEnteredViewport } = useLazyLoad<HTMLDivElement>();
  const { activeRelay } = useActiveRelay();
  const { setActiveGroupId } = useActiveGroup();

  const { metadata } = useGroupMetadata(
    hasEnteredViewport ? activeRelay : undefined,
    hasEnteredViewport ? groupId : undefined,
  );

  const { chats } = useGroupChats(
    hasEnteredViewport ? activeRelay : undefined,
    hasEnteredViewport ? groupId : undefined,
    hasEnteredViewport ? { limit: 1 } : undefined,
  );

  const lastChat = chats && chats.length > 0 ? chats[chats.length - 1] : undefined;

  if (!metadata) {
    return (
      <Card ref={cardRef} className="shadow-md min-h-56 pb-4">
        <CardHeader className="flex flex-row gap-2 items-center">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>

        <CardContent className="p-4 pt-0 h-2/3 flex flex-col justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16 mt-2" />
          </div>
          <div className="flex items-center text-xs mt-2 mb-1 text-gray-500">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-20 ml-2" />
            <Skeleton className="h-4 w-10 ml-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={cardRef}
      className="shadow-md justify-between hover:bg-gradient-to-r from-gray-400 to-green-100 cursor-pointer min-h-56"
      onClick={() => setActiveGroupId(groupId)}
    >
      <CardHeader className="p-4 space-y-0 flex flex-row gap-2 items-center">
        <GroupAvatar relay={activeRelay} groupId={groupId} />

        <CardTitle className="text-sm font-bold">{metadata.name}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 h-2/3 flex flex-col justify-between">
        {
          // TODO: Too much nesting, refactor this
        }
        <div>
          <div>
            <span className="font-medium">
              <Badge>NIP29 Group</Badge> <Badge>{metadata.isPublic ? 'Public' : 'Private'}</Badge>{' '}
              <Badge>{metadata?.isOpen ? 'Open' : 'Closed'}</Badge>
            </span>
          </div>

          {metadata?.about && (
            <div className="flex items-start text-sm mt-2 [overflow-wrap:anywhere]">
              <span>{ellipsis(metadata?.about, 40)}</span>
            </div>
          )}
        </div>

        {lastChat && (
          <div className="flex items-center text-xs mt-2 mb-1 text-gray-500">
            <div className="w-4 h-4 mr-1 [&_*]:h-full [&_*]:w-full">
              <UserAvatar pubkey={lastChat.pubkey} />
            </div>

            <div>{ellipsis(lastChat.content, 15)}</div>

            <div className="ml-auto">{displayTime(lastChat.timestamp)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
