import { useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';
import { useMemo } from 'react';

import { UserAvatar } from '@/features/users';

import { ellipsis } from '@/shared/utils';

export const MentionListItem = ({
  pubkey,
  query,
  onClick,
}: {
  pubkey: string;
  query: string;
  onClick: (pubkey: string) => void;
}) => {
  const { profile } = useProfile({ pubkey });

  const npub = nip19.npubEncode(pubkey);

  const isVisible = useMemo(() => {
    if (!query) return true;

    const searchTerms = [profile?.displayName, profile?.name, profile?.nip05, npub.slice(0, 15)]
      .filter(Boolean)
      .map((term) => term?.toLowerCase() || '');

    return searchTerms.some((term) => term.includes(query.toLowerCase()));
  }, [profile, pubkey, npub, query]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="flex items-center gap-1 p-1 mt-0.5 hover:bg-primary/10 cursor-pointer rounded-md"
      onClick={() => onClick(pubkey)}
    >
      <div className="[&_span]:w-6 [&_span]:h-6 [&_span]:text-xs">
        <UserAvatar pubkey={pubkey} />
      </div>
      <p className="text-xs truncate">
        {ellipsis(profile?.displayName || profile?.name || profile?.nip05 || npub || pubkey, 15)}
      </p>
    </div>
  );
};
