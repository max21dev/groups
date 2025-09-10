import { NDKEvent, NDKTag } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { UserAvatar } from '@/features/users';

import { EmojiRenderer } from '@/shared/components/emoji-renderer';
import { isEmojiShortcode } from '@/shared/components/emoji-renderer/utils';

import { useAddEventReaction } from '../add-event-reaction/hooks';

export const ChatEventReactions = ({
  reaction,
  refreshReactions,
  eventId,
  eventPubkey,
}: {
  reaction: NDKEvent[];
  refreshReactions: () => Promise<void>;
  eventId: string;
  eventPubkey: string;
}) => {
  const groupedReactions = useMemo(
    () =>
      reaction.reduce(
        (acc, curr) => {
          const key = curr.content;

          if (!acc[key]) {
            acc[key] = { pubkeys: [], tags: undefined };
          }

          acc[key].pubkeys.push(curr.pubkey);

          if (
            !acc[key].tags &&
            Array.isArray(curr.tags) &&
            curr.tags.some((t) => t[0] === 'emoji')
          ) {
            acc[key].tags = curr.tags as NDKTag[];
          }
          return acc;
        },
        {} as Record<string, { pubkeys: string[]; tags?: NDKTag[] }>,
      ),
    [reaction],
  );

  const { addEventReaction } = useAddEventReaction(refreshReactions);

  return (
    <div className="flex flex-wrap gap-1 text-xs text-primary">
      {Object.entries(groupedReactions).map(([content, { pubkeys, tags }]) => (
        <div
          key={`reaction-${content}-${pubkeys.join('-')}`}
          className="flex items-center bg-gray-100 dark:bg-slate-900 p-1 rounded-2xl"
        >
          <div
            className="flex items-center hover:cursor-pointer"
            onClick={() =>
              addEventReaction({
                eventId,
                pubkey: eventPubkey,
                content,
              })
            }
          >
            {pubkeys.length > 3 ? (
              <span className="font-medium ml-1 -mr-1">{pubkeys.length}</span>
            ) : (
              pubkeys.map((pubkey, index) => (
                <div
                  key={`avatar-${content}-${pubkey}-${index}`}
                  className="-mr-1 [&_span]:w-4 [&_span]:h-4"
                >
                  <UserAvatar pubkey={pubkey} />
                </div>
              ))
            )}
            <span className="ml-2 max-w-24 overflow-hidden text-nowrap">
              {isEmojiShortcode(content) ? (
                <EmojiRenderer shortcode={content} tags={tags} />
              ) : (
                <>{content}</>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
