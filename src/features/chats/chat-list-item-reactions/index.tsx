import { EmojiPicker } from '@/shared/components/emoji-picker';
import { Dialog, DialogContent, DialogTitle } from '@/shared/components/ui/dialog';

import { ellipsis } from '@/shared/utils';

type ChatListItemReactionsProps = {
  isOpen: boolean;
  onClose: () => void;
  onReaction: (emoji: string) => void;
  message: string;
  userName: string;
};

export const ChatListItemReactions = ({
                                        isOpen,
                                        onClose,
                                        onReaction,
                                        message,
                                        userName,
                                      }: ChatListItemReactionsProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="sr-only">Emoji Picker Modal</DialogTitle>
      <DialogContent className=" bg-slate-300 dark:bg-slate-900 w-fit gap-0 p-0 border-0 outline-none [&>button]:hidden overflow-hidden">
        <div className="w-full flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-600 p-4 rounded-lg w-80">
            <span className="font-bold text-blue-500">{userName}</span>
            <p className="[overflow-wrap:anywhere]">{ellipsis(message, 75)}</p>
          </div>
        </div>
        <EmojiPicker
          onChange={(emoji: string) => {
            onReaction(emoji);
            onClose();
          }}
          alwaysVisible
        />
      </DialogContent>
    </Dialog>
  );
};