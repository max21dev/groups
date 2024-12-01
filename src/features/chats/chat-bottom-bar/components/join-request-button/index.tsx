import { Button } from '@/shared/components/ui/button';

import { useJoinRequestButton } from './hooks';

export const JoinRequestButton = ({
  relay,
  groupId,
}: {
  relay: string | undefined;
  groupId: string | undefined;
}) => {
  const { sendJoinRequest } = useJoinRequestButton(relay, groupId);

  return (
    <Button size="lg" onClick={() => sendJoinRequest()}>
      Join Request
    </Button>
  );
};
