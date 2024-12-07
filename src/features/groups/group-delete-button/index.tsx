import { Trash } from 'lucide-react';
import { deleteGroup } from 'nostr-hooks/nip29';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';

import { ConfirmDialog } from '@/shared/components/confirm-dialog';

export const GroupDeleteButton = ({
  relay,
  groupId,
}: {
  relay: string | undefined;
  groupId: string | undefined;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  const handleDeleteGroup = () => {
    relay &&
      groupId &&
      deleteGroup({
        relay,
        groupId,
        reason: '',
        onSuccess: () => {
          toast({ title: 'Success', description: 'Group deleted' });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({ title: 'Error', description: 'Failed to delete group', variant: 'destructive' });
          setIsDialogOpen(false);
        },
      });
  };

  return (
    <ConfirmDialog
      triggerButton={
        <Button variant="destructive">
          <Trash className="h-3 w-3 m-2" />
          Delete Group
        </Button>
      }
      title="Confirm Delete"
      confirmButtonLabel="Yes, Delete Group"
      confirmButtonVariant="destructive"
      confirmAction={handleDeleteGroup}
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <p>Are you sure you want to delete this group?</p>
      <p>attention: there is no way to return this delete action</p>
    </ConfirmDialog>
  );
};
