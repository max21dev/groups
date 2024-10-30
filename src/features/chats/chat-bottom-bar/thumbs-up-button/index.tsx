import { ThumbsUpIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

export type ThumbUpButtonProps = {
  handleThumbsUp: () => void;
};

export const ThumbsUpButton = ({ handleThumbsUp }: ThumbUpButtonProps) => {
  return (
    <Button size="icon" variant="link" onClick={handleThumbsUp}>
      <ThumbsUpIcon size={20} className="text-muted-foreground" />
    </Button>
  );
};
