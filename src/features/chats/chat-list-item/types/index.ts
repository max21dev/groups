import React from 'react';

import { GroupMessage } from '@/shared/types';

export type ChatListItemProps = {
  itemIndex: number;
  message?: GroupMessage;
  messages: GroupMessage[];
  scrollToMessage: (messageId: string) => void;
  setDeletedMessages: React.Dispatch<React.SetStateAction<string[]>>;
};

export type MessageContentCategory = 'text' | 'image' | 'url';

export type CategorizedMessageContent = {
  category: MessageContentCategory;
  content: string;
};
