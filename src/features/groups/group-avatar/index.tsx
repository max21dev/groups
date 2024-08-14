import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';

import { loader } from '@/shared/utils';

import { useGroupAvatar } from './hooks';
import { getBackgroundColor } from './utils';

export const GroupAvatar = ({ groupId }: { groupId: string | undefined }) => {
  const { picture, name } = useGroupAvatar(groupId);

  return (
    <Avatar
      className={`flex justify-center items-center ${!picture ? getBackgroundColor(name || '') : ''}`}
    >
      {picture ? (
        <AvatarImage
          src={loader(picture, { w: 50, h: 50 })}
          alt={name}
          width={6}
          height={6}
          className="w-10 h-10"
        />
      ) : (
        <span className="text-white text-lg">{name?.[0].toUpperCase()}</span>
      )}
    </Avatar>
  );
};
