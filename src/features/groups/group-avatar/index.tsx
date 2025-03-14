import { AvatarFallback } from '@radix-ui/react-avatar';
import { memo } from 'react';

import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';

import { cn, getAvatarFallbackColor, loader } from '@/shared/utils';

import { useGroupAvatar } from './hooks';

export const GroupAvatar = memo(
  ({ relay, groupId }: { relay: string | undefined; groupId: string | undefined }) => {
    const { picture, name, isLoadingGroupAvatar } = useGroupAvatar(relay, groupId);

    return (
      <Avatar>
        {!groupId || !relay || isLoadingGroupAvatar ? (
          <div className="w-full h-full bg-muted"></div>
        ) : (
          <>
            <AvatarImage
              src={loader(picture || '', { w: 50, h: 50 })}
              alt={name}
              className="w-10 h-10"
            />
            <AvatarFallback
              className={cn(
                'w-full h-full flex justify-center items-center',
                getAvatarFallbackColor(groupId),
              )}
            >
              <span className="text-white text-lg">{name?.[0]?.toUpperCase()}</span>
            </AvatarFallback>
          </>
        )}
      </Avatar>
    );
  },
  (prevProps, nextProps) =>
    prevProps.groupId === nextProps.groupId && prevProps.relay === nextProps.relay,
);
