import { Button } from '@/shared/components/ui/button';

import { useJoinRequestButton } from './hooks';

export const JoinRequestButton = ({
  relay,
  groupId,
  size = 'lg',
  variant = 'default',
  text = 'Join Request',
}: {
  relay: string | undefined;
  groupId: string | undefined;
  text?: string;
  size?: 'sm' | 'lg' | 'default' | 'icon';
  variant?: 'default' | 'secondary' | 'link' | 'destructive' | 'outline' | 'ghost';
}) => {
  const { sendJoinRequest } = useJoinRequestButton(relay, groupId);

  return (
    <Button size={size} variant={variant} onClick={() => sendJoinRequest()}>
      {text}
    </Button>
  );
};
