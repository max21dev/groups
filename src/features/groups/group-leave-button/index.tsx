import { Trash } from 'lucide-react';
import { sendGroupLeaveRequest } from 'nostr-hooks/nip29';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';

import { ConfirmDialog } from '@/shared/components/confirm-dialog';

export const GroupLeaveButton = ({
  relay,
  groupId,
}: {
  relay: string | undefined;
  groupId: string | undefined;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  const handleLeaveGroup = () => {
    relay &&
      groupId &&
      sendGroupLeaveRequest({
        relay,
        groupId,
        leaveRequest: {
          reason: '',
        },
        onSuccess: () => {
          toast({ title: 'Success', description: 'Left the group' });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({ title: 'Error', description: 'Failed to leave group', variant: 'destructive' });
          setIsDialogOpen(false);
        },
      });
  };

  return (
    <ConfirmDialog
      triggerButton={
        <Button variant="destructive">
          <Trash className="h-3 w-3 m-2" />
          Leave Group
        </Button>
      }
      title="Confirm Delete"
      confirmButtonLabel="Yes, Leave Group"
      confirmButtonVariant="destructive"
      confirmAction={handleLeaveGroup}
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <p>Are you sure you want to leave this group?</p>
    </ConfirmDialog>
  );
};
