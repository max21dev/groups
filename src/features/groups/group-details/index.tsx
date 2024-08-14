import { GroupAvatar } from '@/features/groups';
import { UserInfoRow } from '@/features/users';

import { useGroupDetails } from './hooks';

export const GroupDetails = ({ groupId }: { groupId: string }) => {
  const { admins, group, members } = useGroupDetails({ groupId });

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center min-h-3">
        <GroupAvatar key={groupId} groupId={groupId} />
        <div className="text-sm font-light mt-2">{group?.id}</div>
        <div className="text-lg font-medium">{group?.name}</div>
        <div className="text-sm text-gray-600 mb-4">{group?.about}</div>
      </div>
      <div className="m-0">
        {admins && (
          <div>
            <h5 className="font-medium pb-2 m-4 border-b-2 border-b-blue-100">
              Admins ({admins.length})
            </h5>
            {admins.map((admin) => (
              <UserInfoRow pubkey={admin.publicKey} key={admin.publicKey} />
            ))}
          </div>
        )}
        {members && (
          <div>
            <h5 className="font-medium pb-2 m-4 border-b-2 border-b-blue-100">
              Members ({members.length}){' '}
            </h5>
            {members.map((member) => (
              <UserInfoRow pubkey={member.publicKey} key={member.publicKey} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
