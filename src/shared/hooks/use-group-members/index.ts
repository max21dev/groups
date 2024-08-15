import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

export const useGroupMembers = (groupId: string | undefined) => {
  const { events } = useSubscribe(
    useMemo(
      () => ({
        filters: !groupId ? [] : [{ kinds: [39002 as NDKKind], '#d': [groupId], limit: 1 }],
        enabled: !!groupId,
        opts: { groupable: false },
      }),
      [groupId],
    ),
  );

  const members = useMemo(
    () =>
      events && events.length > 0
        ? events[events.length - 1].getMatchingTags('p').map((pTag) => ({
            publicKey: pTag[1],
          }))
        : [],
    [events],
  );

  return { members };
};
