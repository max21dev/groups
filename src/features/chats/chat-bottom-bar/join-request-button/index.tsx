import { Button } from '@/shared/components/ui/button';

import { useJoinRequestButton } from './hooks';

export const JoinRequestButton = ({ groupId }: { groupId: string | undefined }) => {
  const { sendJoinRequest } = useJoinRequestButton({ groupId });

  return (
    <Button size="lg" onClick={() => sendJoinRequest()}>
      Join Request
    </Button>
  );
};
