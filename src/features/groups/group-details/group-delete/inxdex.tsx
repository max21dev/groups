import { Button } from '@/shared/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog.tsx';

import { useState } from 'react';
import { useGroupDetails } from '@/features/groups/group-details/hooks';
import { Trash } from 'lucide-react';

export const DeleteGroup = ({ groupId }: { groupId: string | undefined }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { handleDeleteGroup } = useGroupDetails({ groupId });
  const handleDelete = (event: React.FormEvent) => {
    event.preventDefault();
    handleDeleteGroup(setIsDialogOpen);
  };

  return (
    <>
      <Button className='ml-2' variant="destructive" onClick={() => setIsDialogOpen(true)}>
        <Trash className="mr-2 h-4 w-4" />Delete Group
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this group?</p>
          <p>attention: there is no way to return this delete action</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
