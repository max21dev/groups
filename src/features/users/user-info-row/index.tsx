import { useProfile } from 'nostr-hooks';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import { Badge } from '@/shared/components/ui/badge';

import { ellipsis } from '@/shared/utils';

export function UserInfoRow({ pubkey, roles }: { pubkey: string | undefined; roles?: string[] }) {
  const { profile } = useProfile({ pubkey });

  if (!profile) return null;

  return (
    <div className="flex items-center gap-4 p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="flex justify-center items-center">
              {!profile.image ? (
                <AvatarFallback>{pubkey?.slice(0, 2).toUpperCase()}</AvatarFallback>
              ) : (
                <AvatarImage src={profile.image} alt={profile.name || 'profile'} />
              )}
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{profile.name || pubkey}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex flex-col justify-center">
        <span className="text-sm">{profile.name}</span>
        <span className="text-sm">{profile.nip05}</span>
        {!profile.name && !profile.nip05 && pubkey && (
          <span className="text-sm text-gray-500">{ellipsis(pubkey, 10)}</span>
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
  );
}
