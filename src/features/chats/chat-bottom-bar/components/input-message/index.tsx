import { Textarea } from '@/shared/components/ui/textarea';

export type InputMessageProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  message: string;
  setMessage: (message: string) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export const InputMessage = ({
  textareaRef,
  message,
  setMessage,
  handleKeyPress,
  placeholder = 'Write a message...',
}: InputMessageProps) => {
  return (
    <Textarea
      ref={textareaRef}
      autoComplete="off"
      value={message}
      onKeyDown={handleKeyPress}
      onChange={(event) => setMessage(event.target.value)}
      name="message"
      placeholder={placeholder}
      className="w-full border flex items-center resize-none overflow-x-hidden overflow-y-auto bg-background max-h-64"
    />
  );
};
