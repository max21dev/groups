import { Edit, Undo2 } from 'lucide-react';
import { useGroupAdmins, useGroupMembers, useGroupMetadata } from 'nostr-hooks/nip29';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';

import {
  GroupAvatar,
  GroupDeleteButton,
  GroupLeaveButton,
  GroupLinkButton,
} from '@/features/groups';
import { UserInfoRow } from '@/features/users';
import { GroupMetadataForm } from '../group-metadata-form';

export const GroupDetails = ({
  relay,
  groupId,
}: {
  relay: string | undefined;
  groupId: string | undefined;
}) => {
  const { metadata } = useGroupMetadata(relay, groupId);
  const { admins } = useGroupAdmins(relay, groupId);
  const { members } = useGroupMembers(relay, groupId);

  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setEditMode(!editMode)}>
          {editMode ? <Undo2 className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
          {editMode ? 'Back to view mode' : 'Edit'}
        </Button>

        <GroupLinkButton />

        <GroupLeaveButton relay={relay} groupId={groupId} />

        <GroupDeleteButton relay={relay} groupId={groupId} />
      </div>
      {editMode && metadata ? (
        <GroupMetadataForm relay={relay} groupId={groupId} initialMetadata={metadata} />
      ) : (
        <div className="h-full overflow-y-auto mt-4 [overflow-wrap:anywhere]">
          <div className="flex flex-col items-center min-h-3">
            <GroupAvatar key={groupId} relay={relay} groupId={groupId} />
            <div className="text-sm font-light mt-2">{groupId}</div>
            <div className="text-lg font-medium">{metadata?.name}</div>
            <div className="text-sm text-gray-600 mb-4">{metadata?.about}</div>
          </div>
          <div className="m-0">
            {admins && (
              <div>
                <h5 className="font-medium pb-2 m-4 border-b-2 border-b-blue-100">
                  Admins ({admins.length})
                </h5>
                {admins.map((admin) => (
                  <UserInfoRow key={admin.pubkey} pubkey={admin.pubkey} roles={admin.roles} />
                ))}
              </div>
            )}
            {members && (
              <div>
                <h5 className="font-medium pb-2 m-4 border-b-2 border-b-blue-100">
                  Members ({members.length}){' '}
                </h5>
                {members.map((member) => (
                  <UserInfoRow key={member.pubkey} pubkey={member.pubkey} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
