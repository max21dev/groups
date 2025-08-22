import { useProfile } from 'nostr-hooks';

import { cn, ellipsis } from '@/shared/utils';

export const UserName = ({
  pubkey,
  length,
  className,
}: {
  pubkey: string | null | undefined;
  length?: number;
  className?: string;
}) => {
  if (!pubkey) return null;

  const { profile } = useProfile({ pubkey });

  const userName = length
    ? ellipsis(profile?.displayName || profile?.name || pubkey, length)
    : profile?.displayName || profile?.name || pubkey;

  return <p className={cn('truncate', className)}>{userName}</p>;
};
