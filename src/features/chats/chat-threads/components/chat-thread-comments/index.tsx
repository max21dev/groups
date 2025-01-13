import { Spinner } from '@/shared/components/spinner';

import { ChatEvent } from '@/features/chats/chat-event';
import { SendThreadComment } from '@/features/chats/chat-threads/components';

import { useChatThreadComments } from './hooks';

export const ChatThreadComments = ({ parentId }: { parentId: string }) => {
  const { threadComments, isLoadingThreadComments, hasMoreThreadComments, loadMoreThreadComments } =
    useChatThreadComments(parentId);

  return (
    <div>
      <div className="flex justify-between items-center py-1 mt-2 border-b border-b-slate-400">
        <h4>Comments</h4>
        <SendThreadComment rootId={parentId} />
      </div>

      {isLoadingThreadComments && <Spinner />}

      {!isLoadingThreadComments && !threadComments && (
        <div className="w-full p-2 text-center">No Comments found.</div>
      )}

      <div className="flex flex-col-reverse gap-1 [&_>*]:rounded-none divide-y divide-y-reverse divide-gray-400">
        {threadComments?.map((threadComment) => (
          <ChatEvent key={threadComment.id} event={threadComment.id} />
        ))}
      </div>

      {hasMoreThreadComments && (
        <div
          className="w-full text-center pt-2 text-blue-400 text-sm hover:underline cursor-pointer border-t border-t-slate-400"
          onClick={() => loadMoreThreadComments()}
        >
          Show more comments
        </div>
      )}
    </div>
  );
};
