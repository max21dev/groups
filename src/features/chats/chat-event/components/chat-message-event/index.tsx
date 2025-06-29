import { NostrEvent } from '@nostr-dev-kit/ndk';

import { ChatReply } from '@/features/chats/chat-list/components/chat-list-item/components';
import { UserAvatar } from '@/features/users';

import { RichText } from '@/shared/components/rich-text';

export const ChatMessageEvent = ({ event }: { event: NostrEvent }) => {
  const parentIdTag = event.tags.find(([t]) => t === 'q');
  const parentId = parentIdTag ? parentIdTag[1] : '';

  return (
    <div className="flex gap-2 items-end p-1 outline outline-1 outline-primary/30 rounded-lg">
      <div className="[&_span]:w-8 [&_span]:h-8">
        <UserAvatar pubkey={event.pubkey} />
      </div>
      <div className="bg-primary/10 p-2 rounded-lg">
        {parentId && <ChatReply replyId={parentId} />}
        <div className="flex items-center gap-1">
          <RichText content={event.content} />
        </div>
      </div>
    </div>
  );
};
