import { Skeleton } from '@/shared/components/ui/skeleton';
import { ellipsis, loader } from '@/shared/utils';

import { useChatReply } from './hooks';

export const ChatReply = ({
  replyId,
  scrollToChat,
}: {
  replyId: string;
  scrollToChat: (chatId: string) => void;
}) => {
  const {
    reply,
    replyAuthorProfile,
    firstReplyImageUrl,
    isLoadingChats,
    replyRef,
    hasEnteredViewport,
  } = useChatReply(replyId);

  return (
    <div
      ref={replyRef}
      className="mb-2 bg-primary/20 border-l-4 border-primary/25 rounded-lg p-1 flex items-start gap-2"
    >
      {isLoadingChats || !hasEnteredViewport ? (
        <div className="w-full flex flex-col p-1 pe-2 gap-1.5">
          <Skeleton className="h-1.5 w-12" />
          <Skeleton className="h-1.5 w-full" />
        </div>
      ) : !reply ? (
        <div className="w-full flex flex-col p-1 pe-2 gap-1.5">
          <p className="text-xs font-semibold opacity-60">Reply not found.</p>
        </div>
      ) : (
        <div
          className="text-xs w-full cursor-pointer flex items-center gap-2"
          onClick={() => scrollToChat(replyId)}
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
            <div className="[overflow-wrap:anywhere]">{ellipsis(reply?.content || '', 50)}</div>
          </div>
        </div>
      )}
    </div>
  );
};
