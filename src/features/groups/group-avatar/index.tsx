import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';

import { cn, getAvatarFallbackColor, loader } from '@/shared/utils';

import { AvatarFallback } from '@radix-ui/react-avatar';
import { useGroupAvatar } from './hooks';

export const GroupAvatar = ({
  relay,
  groupId,
}: {
  relay: string | undefined;
  groupId: string | undefined;
}) => {
  const { picture, name, isLoadingGroupAvatar } = useGroupAvatar(relay, groupId);

  return (
    <Avatar>
      {!groupId || !relay || isLoadingGroupAvatar ? (
        <div className="w-full h-full bg-muted" />
      ) : picture ? (
        <>
          <AvatarImage src={loader(picture, { w: 50, h: 50 })} alt={name} className="w-10 h-10" />

          <AvatarFallback>
            <img src={picture} className="w-full aspect-square" alt={name} />
          </AvatarFallback>
        </>
      ) : (
        <div
          className={cn(
            'w-full h-full flex justify-center items-center',
            getAvatarFallbackColor(groupId),
          )}
        >
          <span className="text-white text-lg">{name?.[0].toUpperCase()}</span>
        </div>
      )}
    </Avatar>
  );
};
