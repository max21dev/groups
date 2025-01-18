import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { UserAvatar } from '@/features/users';

export const ChatEventReactions = ({ reaction }: { reaction: NDKEvent[] }) => {
  const groupedReactions = useMemo(
    () =>
      reaction.reduce(
        (acc, curr) => {
          if (!acc[curr.content]) {
            acc[curr.content] = [];
          }
          acc[curr.content].push(curr.pubkey);
          return acc;
        },
        {} as Record<string, string[]>,
      ),
    [reaction],
  );

  return (
    <div className="flex flex-wrap gap-1 text-xs text-primary">
      {Object.entries(groupedReactions).map(([content, pubkeys]) => (
        <div
          key={`reaction-${content}-${pubkeys.join('-')}`}
          className="flex items-center bg-gray-100 dark:bg-slate-900 p-1 rounded-2xl"
        >
          <div className="flex items-center">
            {pubkeys.length > 3 ? (
              <span className="font-medium ml-1 -mr-1">{pubkeys.length}</span>
            ) : (
              pubkeys.map((pubkey, index) => (
                <div
                  key={`avatar-${content}-${pubkey}-${index}`}
                  className="-mr-1 w-4 h-4 [&_*]:h-full [&_*]:w-full"
                >
                  <UserAvatar pubkey={pubkey} />
                </div>
              ))
            )}
            <span className="ml-2">{content}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
