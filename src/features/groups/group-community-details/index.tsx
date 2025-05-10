import { CheckIcon, Copy } from 'lucide-react';
import { useProfile } from 'nostr-hooks';
import { memo, useMemo } from 'react';

import { getCommunityTags } from '@/features/chats/chat-event/components/community/utils';
import { GroupLinkButton, GroupNotification } from '@/features/groups';
import { UserAvatar, UserName } from '@/features/users';

import { Input } from '@/shared/components/ui/input';
import { useCommunity, useCopyToClipboard } from '@/shared/hooks';
import { getNostrLink } from '@/shared/utils';

export const CommunityDetails = memo(
  ({ relay, pubkey }: { relay: string | undefined; pubkey: string | undefined }) => {
    const { communityEvent } = useCommunity(pubkey, relay);
    const { profile } = useProfile({ pubkey });

    const communityNostrLink = getNostrLink(communityEvent?.id || '', pubkey, communityEvent?.kind);

    const { relayTags, blossomTags, mintTags } = useMemo(
      () => getCommunityTags(communityEvent?.rawEvent() ?? null),
      [communityEvent],
    );

    const { hasCopied, copyToClipboard } = useCopyToClipboard();

    return (
      <div>
        <div className="flex flex-wrap gap-2">
          <GroupLinkButton />
          <GroupNotification groupId={pubkey} />
        </div>

        <div className="h-full overflow-y-auto mt-4 [overflow-wrap:anywhere]">
          <div className="flex flex-col items-center gap-2 min-h-3">
            <UserAvatar pubkey={pubkey || ''} />
            <UserName pubkey={pubkey} className="text-lg font-medium" />
            <div className="flex flex-row-reverse items-center gap-2 w-full">
              <button
                onClick={() => copyToClipboard(communityNostrLink || '')}
                className="outline-none text-gray-500"
              >
                {hasCopied ? <CheckIcon className="text-green-600" /> : <Copy />}
              </button>
              <Input value={communityNostrLink || ''} className="" readOnly />
            </div>
            <div className="text-sm text-gray-600 mb-4">{profile?.about}</div>
          </div>
          <div className="mt-2 space-y-2 text-primary/80 text-sm">
            {relayTags.length > 0 && (
              <div>
                <p className="font-semibold">Relays:</p>
                {relayTags.map((tag) => (
                  <span key={tag} className="underline">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {blossomTags.length > 0 && (
              <div>
                <p className="font-semibold">Media Servers:</p>{' '}
                {blossomTags.map((tag) => (
                  <span key={tag} className="underline">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {mintTags.length > 0 && (
              <div>
                <p className="font-semibold">Mint:</p>{' '}
                {mintTags.map((tag) => (
                  <span key={tag} className="underline">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.pubkey === nextProps.pubkey && prevProps.relay === nextProps.relay,
);