import { SendHorizontalIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

export type SendButtonProps = {
  handleSend: () => void;
  disabled?: boolean;
};

export const SendButton = ({ handleSend, disabled = false }: SendButtonProps) => {
  return (
    <Button size="icon" variant="ghost" className="group" onClick={handleSend} disabled={disabled}>
      <SendHorizontalIcon
        size={20}
        className="text-muted-foreground group-hover:text-accent-foreground"
      />
    </Button>
  );
};
