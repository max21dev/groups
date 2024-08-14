import { format } from 'date-fns';
import { Trash2, Undo } from 'lucide-react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu.tsx';

import { UserAvatar } from '@/features/users/user-avatar';

import { cn, ellipsis, loader } from '@/shared/utils';

import { useChatListItem } from './hooks';
import { ChatListItemProps } from './types';

export const ChatListItem = ({
  message,
  itemIndex,
  messages,
  scrollToMessage,
  setDeletedMessages,
}: ChatListItemProps) => {
  const {
    profile,
    deleteMessage,
    firstMessageAuthor,
    isLastMessage,
    sameAuthorAsNextMessage,
    sameAsCurrentUser,
    canDeleteEvent,
    setReplyTo,
    categorizedMessageContent,
  } = useChatListItem({ itemIndex, messages, message });

  if (!message) return null;

  return (
    <div className={cn('flex ml-3 gap-3', !sameAuthorAsNextMessage ? 'mb-4' : 'mb-0')}>
      {!sameAsCurrentUser && (
        <>
          {isLastMessage || !sameAuthorAsNextMessage ? (
            <div className="mt-auto">
              <UserAvatar pubkey={message.authorPublicKey} />
            </div>
          ) : (
            <div className="w-10" />
          )}
        </>
      )}

      <div className="flex flex-col">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                'p-2 mt-1 rounded-lg max-w-xl whitespace-pre-wrap',
                sameAsCurrentUser ? 'bg-blue-500 text-white mr-2' : 'bg-gray-400 text-white',
              )}
            >
              {firstMessageAuthor && (
                <div className="text-sm font-semibold opacity-40">
                  {profile?.name ? profile.name : message.authorPublicKey.slice(0, 5) + '...'}
                </div>
              )}

              {message.replyTo && (
                <div
                  className="text-sm bg-white bg-opacity-30 text-white cursor-pointer border-l-4 rounded-lg p-1 flex items-start"
                  onClick={() => scrollToMessage(message.replyTo || '')}
                >
                  <p>
                    {ellipsis(messages?.find((e) => e.id === message?.replyTo)?.content || '', 80)}
                  </p>
                </div>
              )}

              <div
                className={cn(
                  'flex gap-2',
                  message.content.length < 100 ? 'items-end' : 'flex-col justify-end',
                )}
              >
                <div>
                  {categorizedMessageContent.map((part, i) => {
                    if (part.category == 'text') {
                      return (
                        <p key={i} className="text-sm">
                          {part.content}
                        </p>
                      );
                    } else if (part.category == 'image') {
                      return (
                        <img
                          key={i}
                          src={loader(part.content, { w: 200 })}
                          alt="message"
                          className="max-w-full h-40 rounded-lg mt-2"
                          max-width="200"
                        />
                      );
                    } else if (part.category == 'url') {
                      return (
                        <a
                          key={i}
                          href={part.content}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline"
                        >
                          {part.content}
                        </a>
                      );
                    }
                  })}
                </div>

                <span className="ml-auto text-end text-xs font-light text-gray-300">
                  {format(new Date(message.createdAt * 1000), 'HH:mm')}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {canDeleteEvent && (
              <ContextMenuItem
                onClick={() => {
                  deleteMessage(message.id, message.groupId);
                  setDeletedMessages((prev) => [...(prev || []), message.id]);
                }}
              >
                <Trash2 className="h-4 w-4 mr-3" />
                Delete
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={() => setReplyTo(message)}>
              <Undo className="h-4 w-4 mr-3" />
              Reply
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  );
};
