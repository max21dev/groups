import { useGroupDetails } from './hooks';
import { GroupDetailsView } from '@/features/groups/group-details/group-details-view';
import { useState } from 'react';
import { GroupDetailsEdit } from '@/features/groups/group-details/group-details-edit';
import { Edit, Undo2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const GroupDetails = ({ groupId }: { groupId: string }) => {
  const { admins, group, members, canEditMetadata } = useGroupDetails({ groupId });
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      {canEditMetadata && (
        <Button variant="ghost" onClick={() => setEditMode(!editMode)}>
          {editMode ? <Undo2 className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
          {editMode ? 'Back to view mode' : 'Edit'}
        </Button>
      )}
      {editMode ? (
        <GroupDetailsEdit group={group} />
      ) : (
        <GroupDetailsView group={group} admins={admins} members={members} />
      )}
    </div>
  );
};
