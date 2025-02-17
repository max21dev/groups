import { useMemo } from 'react';

import { ChatContent } from '@/features/chats/chat-list/components/chat-list-item/components';
import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';

export const Note = ({ content }: { content: string }) => {
  const categorizedChatContent = useMemo(() => categorizeChatContent(content || ''), [content]);

  return (
    <div className="set-max-h flex flex-col gap-1 p-2 rounded-md overflow-y-auto [overflow-wrap:anywhere]">
      <ChatContent categorizedChatContent={categorizedChatContent} />
    </div>
  );
};
