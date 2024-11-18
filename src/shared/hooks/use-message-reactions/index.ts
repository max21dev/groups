import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { GroupMessage, LimitFilter } from '@/shared/types';

export const useMessageReactions = (
  groupId: string | undefined,
  message: GroupMessage | undefined,
  limitFilter?: LimitFilter | undefined,
) => {
  const { nip29Ndk } = useNip29Ndk();

  const { events: reactionsEvents } = useSubscribe(
    useMemo(
      () => ({
        filters:
          !message || !groupId
            ? []
            : [
                {
                  kinds: [NDKKind.Reaction],
                  '#h': [groupId],
                  '#e': [message.id],
                  ...limitFilter,
                },
              ],
        enabled: !!message?.id,
        customNdk: nip29Ndk,
      }),
      [message, groupId, limitFilter, nip29Ndk],
    ),
  );
  const reactions = useMemo(() => {
    const groupedReactions: { content: string; pubkeys: string[] }[] = [];
    reactionsEvents.forEach((e) => {
      const reaction = groupedReactions.find((r) => r.content === e.content);
      if (reaction) {
        reaction.pubkeys.push(e.pubkey);
      } else {
        groupedReactions.push({ content: e.content, pubkeys: [e.pubkey] });
      }
    });
    return {
      messageId: message?.id,
      groupedReactions:groupedReactions,
    };
  }, [message?.id, reactionsEvents]);

  return { reactions };
};
