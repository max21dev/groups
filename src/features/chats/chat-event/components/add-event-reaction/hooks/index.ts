import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';

type AddEventReactionParams = {
  eventId: string;
  pubkey: string;
  content: string;
};

export const useAddEventReaction = (refreshReactions: () => Promise<void>) => {
  const { activeUser } = useActiveUser();
  const { ndk } = useNdk();

  const addEventReaction = async ({ eventId, pubkey, content }: AddEventReactionParams) => {
    if (!ndk || !activeUser) {
      return;
    }

    const reactionEvent = new NDKEvent(ndk, {
      kind: NDKKind.Reaction,
      tags: [
        ['e', eventId],
        ['p', pubkey],
      ],
      content: content,
      created_at: Math.floor(Date.now() / 1000),
      pubkey: activeUser.pubkey,
    });

    await reactionEvent.publish();
    await refreshReactions();
    return reactionEvent;
  };

  return { addEventReaction, activeUser };
};
