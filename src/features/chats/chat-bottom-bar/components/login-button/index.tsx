import { Button } from '@/shared/components/ui/button';

export type LoginButtonProps = {
  openLoginModal: () => void;
  text?: string;
  size?: 'sm' | 'lg' | 'default' | 'icon';
  variant?: 'default' | 'secondary' | 'link' | 'destructive' | 'outline' | 'ghost';
};

export const LoginButton = ({
  openLoginModal,
  size = 'lg',
  variant = 'default',
  text = 'To send messages, please login first.',
}: LoginButtonProps) => {
  return (
    <Button size={size} variant={variant} onClick={openLoginModal}>
      {text}
    </Button>
  );
};
