import { ChatContent } from '@/features/chats/chat-list/components/chat-list-item/components';

import { Input } from '@/shared/components/ui/input';

import { useVote } from './hooks';

export const Vote = ({
  pollId,
  pollType,
  optionId,
  label,
  votes,
  canVote,
  selectedOptions,
  setSelectedOptions,
}: {
  pollId: string;
  pollType: 'singlechoice' | 'multiplechoice';
  optionId: string;
  label: string;
  votes: number;
  canVote: boolean;
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { categorizedChatContent, isChecked, handleChange } = useVote({
    pollType,
    optionId,
    label,
    selectedOptions,
    setSelectedOptions,
  });

  const inputId = `${pollId}-${optionId}`;

  return (
    <li className="p-2 rounded-md bg-black/5 list-none">
      {canVote ? (
        <label className="flex items-center justify-between cursor-pointer" htmlFor={inputId}>
          <Input
            id={inputId}
            className="w-5 h-5 shadow-none"
            type={pollType === 'multiplechoice' ? 'checkbox' : 'radio'}
            name={pollId}
            value={optionId}
            checked={isChecked}
            onChange={(e) => handleChange(e.target.checked)}
          />
          <div className="flex flex-col gap-2 w-full">
            <ChatContent categorizedChatContent={categorizedChatContent} />
          </div>
        </label>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2 w-full">
            <ChatContent categorizedChatContent={categorizedChatContent} />
          </div>
        </div>
      )}

      {!canVote && (
        <span className="text-sm text-gray-500 mt-2 block text-center">{votes} votes</span>
      )}
    </li>
  );
};
