import { format } from 'date-fns';
import { SmilePlusIcon, Trash2, Undo, Zap } from 'lucide-react';
import { useState } from 'react';
import ReactPlayer from 'react-player';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';

import { UserAvatar, UserProfileModal } from '@/features/users';
import { UserMention } from '@/features/users/user-mention';
import { useUserProfileModal } from '@/features/users/user-profile-modal/hooks';
import { NotePreview } from './components';

import { cn, ellipsis, loader } from '@/shared/utils';

import { ChatListItemReactions } from './components';
import { useChatListItem } from './hooks';
import { ChatListItemProps } from './types';

export const ChatListItem = ({
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
    categorizedChatContent,
    firstReplyImageUrl,
    replyAuthorProfile,
    reply,
    setZapTarget,
    openZapModal,
    activeUser,
    sendReaction,
    deleteChat,
    categorizedReactions,
  } = useChatListItem({ topChat, bottomChat, nextChat, chats, chat, setDeletedChats, chatsEvents });

  const { isOpen, openModal, closeModal } = useUserProfileModal();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);

  if (!chat) return null;

  const renderChatContent = () => {
    return categorizedChatContent.map((part, i) => {
      switch (part.category) {
        case 'text':
          return (
            <p key={i} className="text-sm">
              {part.content}
            </p>
          );
        case 'image':
          return (
            <img
              key={i}
              src={loader(part.content, { w: 200 })}
              alt="chat"
              className="max-w-full h-40 rounded-lg mt-2 cursor-pointer"
              onClick={() => setSelectedImage(part.content)}
            />
          );
        case 'video':
          return (
            <div className="max-w-full rounded-lg mt-2 react-player">
              <ReactPlayer width="100%" url={part.content} controls />
            </div>
          );
        case 'url':
          return (
            <a
              key={i}
              href={part.content}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-pink-400 underline"
            >
              {part.content}
            </a>
          );
        case 'mention':
          return <UserMention key={i} npub={part.content} sameAsCurrentUser={sameAsCurrentUser} />;
        case 'note':
          return <NotePreview key={i} note={part.content} sameAsCurrentUser={sameAsCurrentUser} />;
        default:
          return null;
      }
    });
  };

  return (
    <div className={cn('flex ml-3 gap-3 relative group', !sameAuthorAsNextChat ? 'mb-4' : 'mb-0')}>
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
                  'p-2 mt-1 rounded-lg max-w-xl max-sm:max-w-72 whitespace-pre-wrap',
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
                  <div
                    className="mb-2 text-xs bg-primary/20 cursor-pointer border-l-4 border-primary/25 rounded-lg p-1 flex items-start gap-2"
                    onClick={() => scrollToChat(chat.parentId || '')}
                  >
                    {firstReplyImageUrl && (
                      <img
                        className="rounded-sm w-8 h-8"
                        src={loader(firstReplyImageUrl, { w: 50, h: 50 })}
                        alt="Reply Chat Image"
                      />
                    )}
                    <div>
                      <div className="text-xs font-semibold opacity-60">
                        {replyAuthorProfile?.displayName
                          ? replyAuthorProfile.displayName
                          : reply?.pubkey?.slice(0, 5) + '...'}
                      </div>
                      <div className="[overflow-wrap:anywhere]">
                        {ellipsis(reply?.content || '', 50)}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'flex gap-2',
                    chat.content.length < 80 ? 'items-center' : 'flex-col justify-end',
                    categorizedReactions && 'flex-col',
                  )}
                >
                  <div className="[overflow-wrap:anywhere] self-start">{renderChatContent()}</div>

                  <div className="ml-auto flex gap-2 items-center text-end text-xs font-light cursor-default">
                    {categorizedReactions && (
                      <div className="flex gap-1">
                        {Object.entries(categorizedReactions).map(([content, reactions]) => (
                          <div
                            key={reactions
                              .map((r) => r.id)
                              .join('-')
                              .substring(0, 10)}
                            className="flex items-center bg-gray-100 dark:bg-slate-900 p-1 rounded-2xl"
                          >
                            {reactions.length < 3 ? (
                              reactions.map((reaction) => (
                                <div
                                  key={reaction.id}
                                  className="-mr-1 w-4 h-4 [&_*]:h-full [&_*]:w-full"
                                >
                                  <UserAvatar pubkey={reaction.pubkey} />
                                </div>
                              ))
                            ) : (
                              <span className="font-medium ml-1 -mr-1">{reactions.length}</span>
                            )}
                            <span className="ml-2">{content}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <span>{format(new Date(chat.timestamp * 1000), 'HH:mm')}</span>
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

                <ContextMenuItem onClick={() => setReplyTo(chat.id)}>
                  <Undo className="h-4 w-4 mr-3" />
                  Reply
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setIsEmojiPickerOpen(true)}>
                  <SmilePlusIcon className="h-4 w-4 mr-3" />
                  React
                </ContextMenuItem>
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

      {/* Image Overlay */}
      {selectedImage && (
        <div
          className="fixed max-w-full p-20 inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Enlarged chat" className="h-auto rounded-lg" />
        </div>
      )}

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
};
