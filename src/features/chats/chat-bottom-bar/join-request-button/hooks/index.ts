import { useActiveUser } from 'nostr-hooks';
import { sendGroupJoinRequest } from 'nostr-hooks/nip29';
import { useCallback } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

import { useLoginModalState } from '@/shared/hooks';

export const useJoinRequestButton = ({ groupId }: { groupId: string | undefined }) => {
  const { toast } = useToast();

  const { activeUser } = useActiveUser();

  const { openLoginModal } = useLoginModalState();

  const sendJoinRequest = useCallback(
    (code?: string, reason?: string) => {
      if (!groupId) return;

      if (!activeUser) {
        openLoginModal();
        return;
      }

      sendGroupJoinRequest({
        groupId: groupId,
        joinRequest: {
          code,
          reason,
        },
        onSuccess: () => {
          toast({ title: 'Success', description: 'Join request sent' });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to send join request',
            variant: 'destructive',
          });
        },
      });
    },
    [groupId, activeUser, openLoginModal, toast],
  );

  return {
    sendJoinRequest,
  };
};
