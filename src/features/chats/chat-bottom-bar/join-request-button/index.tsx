import { Button } from '@/shared/components/ui/button';

export type JoinRequestButtonProps = {
  sendJoinRequest: () => void;
};

export const JoinRequestButton = ({ sendJoinRequest }: JoinRequestButtonProps) => {
  return (
    <Button variant="outline" size="lg" onClick={sendJoinRequest}>
      Send Join Request
    </Button>
  );
};
