import { useProfile } from 'nostr-hooks';
import { Nip29GroupJoinRequest, Nip29GroupLeaveRequest } from 'nostr-hooks/nip29';

import { Badge } from '@/shared/components/ui/badge';

import { ellipsis } from '@/shared/utils';

type UserJoinLeaveBadgeProps = {
  request: Nip29GroupJoinRequest | Nip29GroupLeaveRequest;
  type: 'join' | 'leave';
};
const UserJoinLeaveBadge = ({ request, type }: UserJoinLeaveBadgeProps) => {
  const { profile } = useProfile({ pubkey: request.pubkey });

  return (
    <Badge
      className="my-2 mx-auto text-muted-foreground cursor-default text-center [overflow-wrap:anywhere;]"
      variant="outline"
    >
      {profile?.displayName || profile?.name || ellipsis(request.pubkey, 5)}{' '}
      {type === 'join' ? 'Joined' : 'Left'}
    </Badge>
  );
};
export default UserJoinLeaveBadge;
