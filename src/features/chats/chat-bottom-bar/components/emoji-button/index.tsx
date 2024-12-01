import { EmojiPicker } from '@/shared/components/emoji-picker';

export type EmojiButtonProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  message: string;
  setMessage: (message: string) => void;
};

export const EmojiButton = ({ textareaRef, message, setMessage }: EmojiButtonProps) => {
  return (
    <EmojiPicker
      onChange={(value) => {
        setMessage(message + value);

        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }}
    />
  );
};
