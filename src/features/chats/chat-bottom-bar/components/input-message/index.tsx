import { Textarea } from '@/shared/components/ui/textarea';

export type InputMessageProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  message: string;
  setMessage: (message: string) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const InputMessage = ({
  textareaRef,
  message,
  setMessage,
  handleKeyPress,
  placeholder = 'Write a message...',
  onChange,
}: InputMessageProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    } else {
      setMessage(event.target.value);
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      autoComplete="off"
      value={message}
      onKeyDown={handleKeyPress}
      onChange={handleChange}
      name="message"
      placeholder={placeholder}
      className="w-full border flex items-center resize-none overflow-x-hidden overflow-y-auto bg-background max-h-40"
    />
  );
};
