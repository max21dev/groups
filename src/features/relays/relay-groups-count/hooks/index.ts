import { useGroups } from '@/shared/hooks';

export const useRelayGroupsCount = () => {
  const { groups } = useGroups();

  return { relayGroupsCount: groups.length };
};
