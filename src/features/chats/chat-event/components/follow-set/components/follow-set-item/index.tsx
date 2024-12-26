import { ellipsis } from '@/shared/utils';
import { useProfile } from 'nostr-hooks';

import { UserAvatar } from '@/features/users/user-avatar';
import { UserProfileModal } from '@/features/users/user-profile-modal';
import { useUserProfileModal } from '@/features/users/user-profile-modal/hooks';

export const FollowSetItem = ({ pubkey }: { pubkey: string }) => {
  const { profile } = useProfile({ pubkey });
  const { isOpen, openModal, closeModal } = useUserProfileModal();
  return (
    <>
      <div
        className="flex items-center gap-2 p-2 rounded-md bg-black bg-opacity-20 hover:bg-opacity-25 hover:cursor-pointer"
        onClick={openModal}
      >
        <span className="[&_*]:w-8 [&_*]:h-8">
          <UserAvatar pubkey={pubkey} />
        </span>
        <span className="text-sm">
          {profile?.name || profile?.displayName || profile?.nip05 || ellipsis(pubkey, 5)}
        </span>
      </div>
      {isOpen && <UserProfileModal isOpen={isOpen} onClose={closeModal} pubkey={pubkey} />}
    </>
  );
};
