import { useProfile } from 'nostr-hooks';
import { Link } from 'react-router-dom';

import { cn } from '@/shared/utils';

export const UserMention = ({
                              npub,
                              sameAsCurrentUser,
                            }: {
  npub: string;
  sameAsCurrentUser: boolean;
}) => {
  const { profile } = useProfile({ npub });

  return (
    <Link
      to={`/user/${npub}`}
      className={cn(
        'cursor-pointer',
        sameAsCurrentUser ? 'text-blue-100 underline' : 'text-blue-400',
      )}
    >
      {profile?.displayName || profile?.name || profile?.nip05 || npub}
    </Link>
  );
};