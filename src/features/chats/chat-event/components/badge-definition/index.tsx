import { MedalIcon } from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { ChatContent } from '@/features/chats/chat-list/components/chat-list-item/components';
import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';

export const BadgeDefinition = ({ event }: { event: NostrEvent }) => {
  const idTag = event.tags.find((t) => t[0] === 'd')?.[1] || 'unknown';

  const nameTag = event.tags.find((t) => t[0] === 'name')?.[1] || idTag;

  const descTag = event.tags.find((t) => t[0] === 'description')?.[1];

  const imageTag = event.tags.find((t) => t[0] === 'image')?.[1];

  const thumbTag = event.tags.find((t) => t[0] === 'thumb')?.[1];

  const imageUrl = imageTag || thumbTag;

  const categorizedChatContent = useMemo(() => categorizeChatContent(descTag || ''), [descTag]);

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col items-center gap-2 p-2">
      {imageUrl && <img src={imageUrl} alt={nameTag} className="w-full max-w-48 rounded-md" />}

      <div className="flex items-center gap-1 mt-2">
        <MedalIcon size={18} />
        <h3 className="text-lg font-semibold">{nameTag}</h3>
      </div>
      <div className="[&_*]:text-sm text-center">
        <ChatContent categorizedChatContent={categorizedChatContent} />
      </div>
    </div>
  );
};
