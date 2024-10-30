import { SendHorizontalIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

export type SendButtonProps = {
  handleSend: () => void;
};

export const SendButton = ({ handleSend }: SendButtonProps) => {
  return (
    <Button size="icon" variant="ghost" onClick={handleSend}>
      <SendHorizontalIcon size={20} className="text-muted-foreground" />
    </Button>
  );
};
