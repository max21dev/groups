import { useActiveUser } from 'nostr-hooks';
import {
  deleteGroupEvent,
  putGroupUser,
  useGroupAdmins,
  useGroupJoinRequests,
  useGroupMembers,
  useGroupMetadata,
} from 'nostr-hooks/nip29';
import { useMemo, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useJoinRequests = (relay: string | undefined, groupId: string | undefined) => {
  const [rejectedRequests, setRejectedRequests] = useState<string[]>([]);

  const { activeUser } = useActiveUser();
  const { toast } = useToast();

  const { admins } = useGroupAdmins(relay, groupId);
  const { members } = useGroupMembers(relay, groupId);
  const { joinRequests: rawJoinRequests } = useGroupJoinRequests(relay, groupId);
  const { metadata } = useGroupMetadata(relay, groupId);

  const isGroupClosed = useMemo(() => metadata?.isOpen === false, [metadata]);
  const isAdmin = useMemo(
    () => admins?.some((admin) => admin.pubkey === activeUser?.pubkey) ?? false,
    [admins, activeUser],
  );

  const joinRequests = useMemo(() => {
    if (!rawJoinRequests) return [];
    const filteredRequests = rawJoinRequests.filter(
      (req) =>
        !members?.some((member) => member.pubkey === req.pubkey) &&
        !admins?.some((admin) => admin.pubkey === req.pubkey) &&
        !rejectedRequests.includes(req.id),
    );
    return Array.from(new Map(filteredRequests.map((req) => [req.pubkey, req])).values());
  }, [rawJoinRequests, members, admins, rejectedRequests]);

  const acceptJoinRequest = (pubkey: string) => {
    if (!relay || !groupId) return;
    putGroupUser({
      relay: relay,
      groupId: groupId,
      pubkey,
      onSuccess: () => {
        toast({ title: 'Success', description: 'User accepted successfully' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to accept user', variant: 'destructive' });
      },
    });
  };

  const rejectJoinRequest = (requestId: string) => {
    if (!activeUser || !groupId || !relay) return;

    deleteGroupEvent({
      relay: relay,
      groupId: groupId,
      eventId: requestId,
      onSuccess: () => {
        setRejectedRequests((prev) => [...prev, requestId]);

        toast({
          title: 'Success',
          description: 'Join Request Rejected.',
          variant: 'default',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to reject join request.',
          variant: 'destructive',
        });
      },
    });
  };

  return { isAdmin, activeUser, isGroupClosed, joinRequests, acceptJoinRequest, rejectJoinRequest };
};
