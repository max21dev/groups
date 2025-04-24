import { useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';
import { Link } from 'react-router-dom';

import { cn } from '@/shared/utils';

export const UserMention = ({ userIdentifier }: { userIdentifier: string }) => {
  let npub = userIdentifier;

  const decoded = nip19.decode(userIdentifier);
  if (decoded.type === 'nprofile') {
    npub = nip19.npubEncode(decoded.data.pubkey);
  }

  const { profile } = useProfile({ npub });

  return (
    <Link
      to={`/user/${npub}`}
      className={cn('cursor-pointer underline text-[#18c8f1]', !profile && 'break-all')}
    >
      @{profile?.displayName || profile?.name || profile?.nip05 || npub}
    </Link>
  );
};
