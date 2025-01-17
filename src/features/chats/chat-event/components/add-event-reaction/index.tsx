import { SmilePlusIcon } from 'lucide-react';

import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useState } from 'react';

import { ChatListItemReactions } from '@/features/chats/chat-list/components/chat-list-item/components';

import { ellipsis } from '@/shared/utils';

import { useAddEventReaction } from './hooks';

export const AddEventReaction = ({
  eventId,
  pubkey,
  content,
  profile,
  refreshReactions,
}: {
  eventId: string;
  pubkey: string;
  content: string;
  profile: NDKUserProfile | null | undefined;
  refreshReactions: () => Promise<void>;
}) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const { addEventReaction, activeUser } = useAddEventReaction(refreshReactions);

  if (!activeUser) {
    return null;
  }

  return (
    <>
      <SmilePlusIcon
        className="h-5 w-5 self-end hover:cursor-pointer"
        onClick={() => setIsEmojiPickerOpen(true)}
      />
      {isEmojiPickerOpen && (
        <ChatListItemReactions
          isOpen={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
          onReaction={(emoji: string) => addEventReaction({ eventId, pubkey, content: emoji })}
          chat={content}
          userName={profile?.displayName || profile?.name || ellipsis(pubkey, 5)}
        />
      )}
    </>
  );
};
