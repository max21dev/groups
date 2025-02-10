import { useMemo } from 'react';

import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';

type UseVoteProps = {
  pollType: 'singlechoice' | 'multiplechoice';
  optionId: string;
  label: string;
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

export const useVote = ({
  pollType,
  optionId,
  label,
  selectedOptions,
  setSelectedOptions,
}: UseVoteProps) => {
  const categorizedChatContent = useMemo(() => categorizeChatContent(label || ''), [label]);

  const isChecked = selectedOptions.includes(optionId);

  const handleChange = (checked: boolean) => {
    if (pollType === 'singlechoice') {
      if (checked) {
        setSelectedOptions([optionId]);
      }
    } else {
      if (checked) {
        setSelectedOptions((prev) => [...prev, optionId]);
      } else {
        setSelectedOptions((prev) => prev.filter((id) => id !== optionId));
      }
    }
  };

  return {
    categorizedChatContent,
    isChecked,
    handleChange,
  };
};
