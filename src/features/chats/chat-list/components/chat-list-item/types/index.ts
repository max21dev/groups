import { NDKEvent } from '@nostr-dev-kit/ndk';
import { Nip29GroupChat } from 'nostr-hooks/nip29';
import React from 'react';

export type ChatListItemProps = {
  chat?: Nip29GroupChat;
  chats: Nip29GroupChat[];
  chatsEvents: NDKEvent[] | undefined;
  topChat: Nip29GroupChat | undefined;
  bottomChat: Nip29GroupChat | undefined;
  nextChat: Nip29GroupChat | undefined;
  scrollToChat: (chatId: string) => void;
  setDeletedChats: React.Dispatch<React.SetStateAction<string[]>>;
};
