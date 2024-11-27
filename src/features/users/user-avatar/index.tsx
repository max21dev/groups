import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import { cn, getAvatarFallbackColor, loader } from '@/shared/utils';

import { useUserAvatar } from './hooks';

export function UserAvatar({ pubkey }: { pubkey: string }) {
  const { profile } = useUserAvatar({ pubkey });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar>
            {!profile || !profile.image ? (
              <AvatarFallback
                className={cn('text-primary-foreground', getAvatarFallbackColor(pubkey))}
              >
                {pubkey.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            ) : (
              <AvatarImage src={loader(profile?.image, { w: 50, h: 50 })} alt={profile?.name} />
            )}
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{profile?.name ? profile?.name : pubkey}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
