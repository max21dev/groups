import { useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';

import { Badge } from '@/shared/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import { UserAvatar } from '@/features/users';
import { UserAssignRoleDialog } from '@/features/users/user-assign-role-dialog';

import { ellipsis } from '@/shared/utils';

export function UserInfoRow({ pubkey, roles }: { pubkey: string | undefined; roles?: string[] }) {
  const { profile } = useProfile({ pubkey });

  if (!pubkey) return null;

  const npub = nip19.npubEncode(pubkey);

  return (
    <div className="flex justify-between items-center pe-2 hover:bg-gray-100 rounded-sm">
      <div className="flex items-center gap-4 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <UserAvatar pubkey={pubkey} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{profile?.name || ellipsis(npub, 10)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-col justify-center">
          <span className="text-sm">{profile?.name}</span>
          <span className="text-sm">{profile?.nip05}</span>
          {!profile?.name && !profile?.nip05 && pubkey && (
            <span className="text-sm text-gray-500">{ellipsis(npub, 10)}</span>
          )}
          {roles && (
            <div className="flex gap-2 flex-wrap">
              {roles.map((role) => (
                <Badge key={role}>{role}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-col items-center">
        <UserAssignRoleDialog userPubKey={pubkey} userRoles={roles} />
      </div>
    </div>
  );
}
