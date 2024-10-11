import { Button } from '@/shared/components/ui/button.tsx';

import { useState } from 'react';
import { useGroupDetails } from '@/features/groups/group-details/hooks';
import { Trash } from 'lucide-react';
import { ConfirmDialog } from '@/features/groups/group-details/confirm-dialog';

export const DeleteGroup = ({ groupId }: { groupId: string | undefined }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { handleDeleteGroup } = useGroupDetails({ groupId });
  const handleDelete = () => {
    handleDeleteGroup(setIsDialogOpen);
  };

  return (
      <ConfirmDialog
        triggerButton={
          <Button className="ml-2" variant="destructive">
            <Trash className="h-3 w-3 m-2" />
            Delete Group
          </Button>
        }
        title="Confirm Delete"
        confirmButtonLabel="Yes, Delete Group"
        confirmButtonVariant="destructive"
        confirmAction={handleDelete}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <p>Are you sure you want to delete this group?</p>
        <p>attention: there is no way to return this delete action</p>
      </ConfirmDialog>
  );
};
