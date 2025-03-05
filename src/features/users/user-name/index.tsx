import { useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';

import { cn, ellipsis } from '@/shared/utils';

export const UserName = ({
  pubkey,
  length,
  className,
}: {
  pubkey: string | undefined;
  length?: number;
  className?: string;
}) => {
  const { profile } = useProfile({ pubkey });

  if (!pubkey) return null;

  const npub = nip19.npubEncode(pubkey);

  const userName = length
    ? ellipsis(profile?.displayName || profile?.name || npub || pubkey, length)
    : profile?.displayName || profile?.name || npub || pubkey;

  return <p className={cn('truncate', className)}>{userName}</p>;
};
