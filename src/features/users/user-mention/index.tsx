import { useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';

import { UserProfileModal } from '@/features/users';
import { useUserProfileModal } from '../user-profile-modal/hooks';

import { cn } from '@/shared/utils';

export const UserMention = ({
  npub,
  sameAsCurrentUser,
}: {
  npub: string;
  sameAsCurrentUser: boolean;
}) => {
  const { profile } = useProfile({ npub });
  const { isOpen, openModal, closeModal } = useUserProfileModal();

  const decoded = nip19.decode(npub);
  const pubkey = typeof decoded.data === 'string' ? decoded.data : '';

  return (
    <>
      <span
        className={cn(
          'cursor-pointer',
          sameAsCurrentUser ? 'text-blue-100 underline' : 'text-blue-400',
        )}
        onClick={openModal}
      >
        { profile?.displayName || profile?.name || profile?.nip05 || npub}
      </span>
      {isOpen && <UserProfileModal pubkey={pubkey} isOpen={isOpen} onClose={closeModal} />}
    </>
  );
};
