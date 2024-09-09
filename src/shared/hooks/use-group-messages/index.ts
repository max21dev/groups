import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { LimitFilter } from '@/shared/types';

export const useGroupMessages = (
  groupId: string | undefined,
  limitFilter?: LimitFilter | undefined,
) => {
  const { nip29Ndk } = useNip29Ndk();

  const { events: messagesEvents } = useSubscribe(
    useMemo(
      () => ({
        filters: !groupId
          ? []
          : [
              {
                kinds: [9 as NDKKind],
                '#h': [groupId],
                ...limitFilter,
              },
            ],
        enabled: !!groupId,
        customNdk: nip29Ndk,
      }),
      [groupId, limitFilter, nip29Ndk],
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
        replyTo: e.getMatchingTags('e')[0] ? String(e.getMatchingTags('e')[0][1]) : null,
        event: e,
      })),
    [messagesEvents],
  );

  return { messages };
};
