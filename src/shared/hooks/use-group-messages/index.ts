import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';
import { LimitFilter } from '@/shared/types';

export const useGroupMessages = (
  groupId: string | undefined,
  limitFilter?: LimitFilter | undefined,
) => {
  const { events: messagesEvents } = useSubscribe(
    useMemo(
      () => ({
        filters: !groupId
          ? []
          : [
              {
                kinds: [9 as NDKKind, 10 as NDKKind, 11 as NDKKind, 12 as NDKKind],
                '#h': [groupId],
                ...limitFilter,
              },
            ],
        enabled: !!groupId,
      }),
      [groupId, limitFilter],
    ),
  );

  const messages = useMemo(
    () =>
      messagesEvents.map((e) => ({
        id: e.id,
        authorPublicKey: e.pubkey,
        groupId: String(e.getMatchingTags('h')[0]?.[1]),
        createdAt: e.created_at || 1,
        content: e.content,
        replyTo:
          [10, 12].includes(e.kind as NDKKind) && e.getMatchingTags('e')[0]
            ? String(e.getMatchingTags('e')[0][1])
            : null,
        event: e,
      })),
    [messagesEvents],
  );

  return messages;
};
