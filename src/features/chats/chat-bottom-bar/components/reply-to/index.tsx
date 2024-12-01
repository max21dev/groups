import { Nip29GroupChat } from 'nostr-hooks/nip29';

export type ReplyToProps = {
  replyTo?: string | undefined;
  setReplyTo: (replyTo: string | undefined) => void;
  chats?: Nip29GroupChat[];
};

export const ReplyTo = ({ replyTo, setReplyTo, chats }: ReplyToProps) => {
  if (!replyTo) {
    return null;
  }

  return (
    <div className="p-2 bg-accent border-t w-full flex justify-between items-center">
      <span className="text-sm text-gray-500">
        Replying to: {chats?.find((msg) => msg.id === replyTo)?.content || 'Deleted message'}
      </span>
      <button onClick={() => setReplyTo(undefined)} className="text-sm ml-2">
        Cancel
      </button>
    </div>
  );
};
