import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { ChatEvent } from '@/features/chats';
import { ChatContent } from '@/features/chats/chat-list/components/chat-list-item/components';
import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';

export const Highlight = ({ event }: { event: NostrEvent }) => {
  const categorizedChatContent = useMemo(
    () => categorizeChatContent(event.content || ''),
    [event.content],
  );

  const contextTag = event.tags.find(([t]) => t === 'context');
  const contextText = contextTag ? contextTag[1] : null;

  const sourceEvent = event.tags.find(([t]) => t === 'e' || t === 'a');
  const sourceUrl = event.tags.find(([t]) => t === 'r');

  //const authors = event.tags.filter(([t]) => t === 'p').map(([, pubkey]) => pubkey);

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <blockquote className="border-l-4 [&_*]:text-base border-blue-800 pl-4 italic my-2">
        <ChatContent categorizedChatContent={categorizedChatContent} />
      </blockquote>

      {contextText && (
        <p className="text-sm text-secondary-foreground">
          <strong>Context:</strong> {contextText}
        </p>
      )}

      {sourceEvent && <ChatEvent event={sourceEvent[1]} />}

      {sourceUrl && (
        <p className="text-sm mt-2">
          Source:{' '}
          <a
            href={sourceUrl[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 text-xs underline"
          >
            {sourceUrl[1]}
          </a>
        </p>
      )}
    </div>
  );
};
