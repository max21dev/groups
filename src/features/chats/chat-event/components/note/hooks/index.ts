import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';
import { useMemo, useState } from 'react';

export const useNote = (content: string) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categorizedChatContent = useMemo(() => categorizeChatContent(content || ''), [content]);

  return { categorizedChatContent, selectedImage, setSelectedImage };
};
