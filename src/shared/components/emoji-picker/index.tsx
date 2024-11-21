import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { SmileIcon } from 'lucide-react';

import { useTheme } from '@/shared/components/theme-provider';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

type EmojiPickerProps = {
  onChange: (value: string) => void;
  alwaysVisible?: boolean;
};

export const EmojiPicker = ({ onChange, alwaysVisible = false }: EmojiPickerProps) => {
  const { theme } = useTheme();

  if (alwaysVisible) {
    return (
      <div className="w-full">
        <Picker
          emojiSize={18}
          theme={theme}
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
        />
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon size={20} className="text-muted-foreground hover:text-foreground transition" />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Picker
          emojiSize={18}
          theme={theme}
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};