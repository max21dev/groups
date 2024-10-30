import { Button } from '@/shared/components/ui/button';

export type LoginButtonProps = {
  openLoginModal: () => void;
};

export const LoginButton = ({ openLoginModal }: LoginButtonProps) => {
  return (
    <Button size="lg" onClick={openLoginModal}>
      To send messages, please login first.
    </Button>
  );
};
