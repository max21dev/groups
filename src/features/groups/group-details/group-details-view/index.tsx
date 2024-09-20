import { GroupAvatar } from '@/features/groups';
import { UserInfoRow } from '@/features/users';

import { Group, GroupAdminPermission } from '@/shared/types';

export const GroupDetailsView = ({
  group,
  admins,
  members,
}: {
  group: Group | undefined;
  admins:
    | {
        publicKey: string;
        permissions: GroupAdminPermission[];
      }[]
    | undefined;
  members:
    | {
        publicKey: string;
      }[]
    | undefined;
}) => {
  return (
    <div className="h-full overflow-y-auto mt-4">
      <div className="flex flex-col items-center min-h-3">
        <GroupAvatar key={group?.id} groupId={group?.id} />
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
