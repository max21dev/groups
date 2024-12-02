import { useProfile } from 'nostr-hooks';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import { cn, getAvatarFallbackColor, loader } from '@/shared/utils';

export function UserAvatar({ pubkey }: { pubkey: string }) {
  const { profile } = useProfile({ pubkey });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar>
            <AvatarImage src={loader(profile?.image || '', { w: 50, h: 50 })} alt={profile?.name} />

            <AvatarFallback
              className={cn('text-primary-foreground', getAvatarFallbackColor(pubkey))}
            >
              {pubkey.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{profile?.name ? profile?.name : pubkey}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
