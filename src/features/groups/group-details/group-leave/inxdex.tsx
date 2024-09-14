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

export const LeaveGroup = ({ groupId }: { groupId: string | undefined }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { handleLeaveGroup } = useGroupDetails({ groupId });
  const handleLeave = (event: React.FormEvent) => {
    event.preventDefault();
    handleLeaveGroup(setIsDialogOpen);
  };

  return (
    <>
      <Button className='ml-2' variant="secondary" onClick={() => setIsDialogOpen(true)}>
        <Trash className="mr-2 h-4 w-4" />Leave Group
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to leave this group?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLeave}>
              Yes, Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
