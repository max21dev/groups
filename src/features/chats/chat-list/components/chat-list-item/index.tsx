import { format } from 'date-fns';
import { BanIcon, Copy, SmilePlusIcon, Trash2, Undo, Zap } from 'lucide-react';
import { memo, useState } from 'react';

import { UserAvatar, UserProfileModal } from '@/features/users';
import { useUserProfileModal } from '@/features/users/user-profile-modal/hooks';

import { RichText } from '@/shared/components/rich-text';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';
import { cn } from '@/shared/utils';

import { ChatListItemReactions, ChatReply } from './components';
import { useChatListItem } from './hooks';
import { ChatListItemProps } from './types';

export const ChatListItem = memo(
  ({
    chat,
    chats,
    scrollToChat,
    setDeletedChats,
    chatsEvents,
    topChat,
    bottomChat,
    nextChat,
  }: ChatListItemProps) => {
    const {
      profile,
      topChatAuthor,
      isLastChat,
      sameAuthorAsNextChat,
      sameAsCurrentUser,
      setReplyTo,
      setZapTarget,
      openZapModal,
      activeUser,
      sendReaction,
      deleteChat,
      categorizedReactions,
      copyChatLink,
      isAdmin,
      removeUser,
    } = useChatListItem({
      topChat,
      bottomChat,
      nextChat,
      chats,
      chat,
      setDeletedChats,
      chatsEvents,
    });

    const { isOpen, openModal, closeModal } = useUserProfileModal();

    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);

    if (!chat) return null;

    return (
      <div
        className={cn('flex ml-3 gap-3 relative group', !sameAuthorAsNextChat ? 'mb-4' : 'mb-0')}
      >
        {!sameAsCurrentUser && (
          <div className={isLastChat || !sameAuthorAsNextChat ? 'mt-auto' : 'w-10'}>
            {isLastChat || !sameAuthorAsNextChat ? (
              <div className="cursor-pointer" onClick={openModal}>
                <UserAvatar pubkey={chat.pubkey} />
              </div>
            ) : null}
          </div>
        )}

        <div className={cn('flex gap-1', sameAsCurrentUser && 'flex-row-reverse')}>
          <div className="flex flex-col">
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className={cn(
                    'p-2 mt-1 rounded-lg max-w-[75vw] sm:max-w-[45vw] whitespace-pre-wrap',
                    sameAsCurrentUser
                      ? 'mr-2 bg-blue text-blue-foreground'
                      : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {topChatAuthor && !sameAsCurrentUser && (
                    <div className="mb-1 text-xs font-semibold opacity-50">
                      {profile?.displayName || chat.pubkey.slice(0, 5) + '...'}
                    </div>
                  )}

                  {chat.parentId && (
                    <ChatReply replyId={chat.parentId} scrollToChat={scrollToChat} />
                  )}

                  <div
                    className={cn(
                      'flex gap-2',
                      chat.content.length < 50 ? 'items-center' : 'flex-col justify-end',
                      categorizedReactions && 'flex-col',
                    )}
                  >
                    <div className="w-full [overflow-wrap:anywhere] self-start">
                      <RichText content={chat?.content} eventPreview />
                    </div>

                    <div
                      className={cn(
                        categorizedReactions && 'w-full',
                        'ml-auto mt-auto flex gap-2 items-center text-end text-xs font-light cursor-default',
                      )}
                    >
                      {categorizedReactions && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(categorizedReactions).map(([content, reactions]) => (
                            <div
                              key={reactions
                                .map((r) => r.id)
                                .join('-')
                                .substring(0, 10)}
                              className="flex items-center bg-gray-100 dark:bg-slate-900 p-1 rounded-2xl hover:cursor-pointer"
                              onClick={() => {
                                if (!activeUser) return;
                                sendReaction(content, chat.id);
                              }}
                            >
                              {reactions.length < 3 ? (
                                reactions.map((reaction) => (
                                  <div
                                    key={reaction.id}
                                    className="-mr-1 [&_span]:w-4 [&_span]:h-4"
                                  >
                                    <UserAvatar pubkey={reaction.pubkey} />
                                  </div>
                                ))
                              ) : (
                                <span className="font-medium ml-1 -mr-1">{reactions.length}</span>
                              )}
                              <span className="ml-2 max-w-24 overflow-hidden">{content}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="ml-auto mt-auto">
                        {format(new Date(chat.timestamp * 1000), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </ContextMenuTrigger>
              {activeUser && (
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      deleteChat(chat);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete
                  </ContextMenuItem>

                  <ContextMenuItem onClick={() => copyChatLink(chat.id)}>
                    <Copy className="h-4 w-4 mr-3" />
                    Copy Link
                  </ContextMenuItem>

                  <ContextMenuItem onClick={() => setReplyTo(chat.id)}>
                    <Undo className="h-4 w-4 mr-3" />
                    Reply
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => setIsEmojiPickerOpen(true)}>
                    <SmilePlusIcon className="h-4 w-4 mr-3" />
                    React
                  </ContextMenuItem>
                  {isAdmin && !sameAsCurrentUser && (
                    <ContextMenuItem onClick={() => removeUser(chat.pubkey)}>
                      <BanIcon className="h-4 w-4 mr-3" />
                      Remove User
                    </ContextMenuItem>
                  )}
                  <ContextMenuItem
                    onClick={() => {
                      setZapTarget(chatsEvents?.find((e) => e.id === chat.id));
                      openZapModal();
                    }}
                  >
                    <Zap className="h-4 w-4 mr-3 text-warning" />
                    <span className="text-warning">Zap</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              )}
            </ContextMenu>
          </div>

          <SmilePlusIcon
            className="h-5 w-5 hidden group-hover:block self-end hover:cursor-pointer"
            onClick={() => setIsEmojiPickerOpen(true)}
          />
        </div>

        {/* Chat List Item Reactions */}
        {isEmojiPickerOpen && (
          <ChatListItemReactions
            isOpen={isEmojiPickerOpen}
            onClose={() => setIsEmojiPickerOpen(false)}
            onReaction={(emoji: string) => sendReaction(emoji, chat.id)}
            chat={chat.content}
            userName={profile?.displayName || profile?.name || ''}
          />
        )}

        {/* User Profile Modal */}
        {isOpen && <UserProfileModal pubkey={chat.pubkey} isOpen={isOpen} onClose={closeModal} />}
      </div>
    );
  },
);
