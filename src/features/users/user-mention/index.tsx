import { useProfile } from 'nostr-hooks';
import { Link } from 'react-router-dom';

import { cn } from '@/shared/utils';

export const UserMention = ({ npub }: { npub: string }) => {
  const { profile } = useProfile({ npub });

  return (
    <Link to={`/user/${npub}`} className={cn('cursor-pointer underline text-[#18c8f1]')}>
      @{profile?.displayName || profile?.name || profile?.nip05 || npub}
    </Link>
  );
};
