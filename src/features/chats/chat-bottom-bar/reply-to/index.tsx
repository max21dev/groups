import { GroupMessage } from '@/shared/types';

export type ReplyToProps = {
  replyTo?: GroupMessage;
  setReplyTo: (replyTo: GroupMessage | undefined) => void;
  messages?: GroupMessage[];
};

export const ReplyTo = ({ replyTo, setReplyTo, messages }: ReplyToProps) => {
  if (!replyTo) {
    return null;
  }

  return (
    <div className="p-2 bg-accent border-t w-full flex justify-between items-center">
      <span className="text-sm text-gray-500">
        Replying to: {messages?.find((msg) => msg.id === replyTo.id)?.content || 'Deleted message'}
      </span>
      <button onClick={() => setReplyTo(undefined)} className="text-sm ml-2">
        Cancel
      </button>
    </div>
  );
};
