import { Spinner } from '@/shared/components/spinner';

import { ChatEvent } from '@/features/chats/chat-event';
import { SendThreadComment } from '@/features/chats/chat-threads/components';

import { useChatThreadComments } from './hooks';

export const ChatThreadComments = ({ parentId }: { parentId: string }) => {
  const {
    threadComments,
    isLoadingThreadComments,
    hasMoreThreadComments,
    loadMoreThreadComments,
    deleteThreadComment,
  } = useChatThreadComments(parentId);

  return (
    <div className="w-full max-w-2xl flex flex-col">
      <div className="flex justify-between items-center py-1 mt-2 border-b border-b-slate-400">
        <h4>Comments</h4>
      </div>

      <div className="w-full flex justify-center items-center">
        <SendThreadComment rootId={parentId} />
      </div>
      {isLoadingThreadComments && <Spinner />}

      {!isLoadingThreadComments && !threadComments && (
        <div className="w-full p-2 text-center">No Comments found.</div>
      )}

      <div className="flex flex-col-reverse gap-1">
        {threadComments?.map((threadComment) => (
          <ChatEvent
            key={threadComment.id}
            event={threadComment.id}
            deleteThreadComment={deleteThreadComment}
          />
        ))}
      </div>

      {hasMoreThreadComments && threadComments && threadComments.length > 1 && (
        <div
          className="w-full text-center pt-2 text-blue-400 text-sm hover:underline cursor-pointer"
          onClick={() => loadMoreThreadComments()}
        >
          Show more comments
        </div>
      )}
    </div>
  );
};