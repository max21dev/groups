type UseVoteProps = {
  pollType: 'singlechoice' | 'multiplechoice';
  optionId: string;
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

export const useVote = ({
  pollType,
  optionId,
  selectedOptions,
  setSelectedOptions,
}: UseVoteProps) => {
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
    isChecked,
    handleChange,
  };
};
