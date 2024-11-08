import { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { Group } from '@/shared/types';

import { useGroupDetailsEdit } from './hooks';

import { GroupDetailsEditAdmins } from '@/features/groups/group-details/group-details-edit-admins';
import { GroupDetailsEditMembers } from '@/features/groups/group-details/group-details-edit-members';
import { GroupDetailsEditMetadata } from '@/features/groups/group-details/group-details-edit-metadata';
import { GroupDetailsEditStatus } from '@/features/groups/group-details/group-details-edit-status';

type Props = {
  group: Group | undefined;
  setEditMode: Dispatch<SetStateAction<boolean>>;
};

export const GroupDetailsEdit = ({ group, setEditMode }: Props) => {
  const { metadataForm, groupStatusForm, onSubmitMetadata, onSubmitGroupStatus } =
    useGroupDetailsEdit({
      group,
      setEditMode,
    });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMetadataForm, setIsMetadataForm] = useState(true);

  // Updated Submit Handlers
  const handleSubmitMetadata = (event: React.FormEvent) => {
    event.preventDefault();
    setIsMetadataForm(true);
    setIsDialogOpen(true);
  };

  const handleSubmitStatus = (event: React.FormEvent) => {
    event.preventDefault();
    setIsMetadataForm(false);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (isMetadataForm) {
      metadataForm.handleSubmit(onSubmitMetadata)();
    } else {
      groupStatusForm.handleSubmit(onSubmitGroupStatus)(); // Handle status form
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <Label className="flex mt-4 mb-4">Update info of group: {group?.id}</Label>
      <Tabs defaultValue="metadata" className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
        <TabsContent value="metadata">
          <GroupDetailsEditMetadata
            metadataForm={metadataForm}
            handleSubmitMetadata={handleSubmitMetadata}
          />
        </TabsContent>
        <TabsContent value="status">
          <GroupDetailsEditStatus
            groupStatusForm={groupStatusForm}
            handleSubmitStatus={handleSubmitStatus}
          />
        </TabsContent>
        <TabsContent value="members">
          <GroupDetailsEditMembers />
        </TabsContent>
        <TabsContent value="admins">
          <GroupDetailsEditAdmins />
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to update group info?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
