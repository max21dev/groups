import { RichText } from '@/shared/components/rich-text';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/utils';

import { useVote } from './hooks';

export const Vote = ({
  pollId,
  pollType,
  optionId,
  label,
  votes,
  totalVotes,
  canVote,
  selectedOptions,
  setSelectedOptions,
}: {
  pollId: string;
  pollType: 'singlechoice' | 'multiplechoice';
  optionId: string;
  label: string;
  votes: number;
  totalVotes: number;
  canVote: boolean;
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { isChecked, handleChange } = useVote({
    pollType,
    optionId,
    selectedOptions,
    setSelectedOptions,
  });

  const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;

  const inputId = `${pollId}-${optionId}`;

  return (
    <li
      className={cn(
        'p-2 rounded-md bg-primary/5 list-none',
        isChecked && 'outline outline-1 outline-primary',
      )}
    >
      {canVote ? (
        <label className="flex items-center gap-2 cursor-pointer" htmlFor={inputId}>
          <Input
            id={inputId}
            className={cn(
              'w-5 h-5 p-1 border-muted-foreground appearance-none checked:appearance-auto shadow-none cursor-pointer',
              pollType === 'multiplechoice' ? 'rounded-md' : 'rounded-full',
            )}
            type={pollType === 'multiplechoice' ? 'checkbox' : 'radio'}
            name={pollId}
            value={optionId}
            checked={isChecked}
            onChange={(e) => handleChange(e.target.checked)}
          />
          <div className="flex flex-col gap-2 w-full">
            <RichText content={label} />
          </div>
        </label>
      ) : (
        <div className="flex items-center">
          <div className="flex flex-col gap-2 w-full">
            <RichText content={label} />
          </div>
        </div>
      )}

      {!canVote && (
        <div className="mt-2 flex items-center gap-2">
          <Progress value={percentage} className="h-3" />

          <span className="text-xs inline-block whitespace-nowrap text-muted-foreground text-center">
            {percentage.toFixed(1)}%
          </span>
        </div>
      )}
    </li>
  );
};
