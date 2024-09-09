import { useActiveUser } from 'nostr-hooks';

import {
  useGlobalNdk,
  useGroup,
  useGroupAdmin,
  useGroupAdmins,
  useGroupMembers,
} from '@/shared/hooks';

export const useGroupDetails = ({ groupId }: { groupId: string | undefined }) => {
  const { globalNdk } = useGlobalNdk();

  const { group } = useGroup(groupId);
  const { members } = useGroupMembers(groupId);
  const { admins } = useGroupAdmins(groupId);
  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { canEditMetadata } = useGroupAdmin(groupId, activeUser?.pubkey);

  return { group, members, admins, canEditMetadata };
};
