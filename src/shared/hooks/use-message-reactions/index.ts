import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';
import { GroupMessage, LimitFilter } from '@/shared/types';

export const useMessageReactions = (
  groupId: string | undefined,
  message: GroupMessage | undefined,
  limitFilter?: LimitFilter | undefined,
) => {
  const { events: reactionsEvents } = useSubscribe(
    useMemo(
      () => ({
        filters:
          !message || !groupId
            ? []
            : [
                {
                  kinds: [7 as NDKKind],
                  '#h': [groupId],
                  '#e': [message.id],
                  ...limitFilter,
                },
              ],
        enabled: !!message?.id,
      }),
      [message, groupId, limitFilter],
    ),
  );

  const reactions = useMemo(
    () => ({
      messageId: message?.id,
      like: reactionsEvents.filter((e) => e.content === '+').length,
      disLike: reactionsEvents.filter((e) => e.content === '-').length,
    }),
    [message?.id, reactionsEvents],
  );

  console.log(reactions);

  return {reactions};
};
