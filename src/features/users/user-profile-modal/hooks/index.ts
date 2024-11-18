import { useGlobalProfile } from '@/shared/hooks';

export const useUserPofileModal = ({ pubkey }: { pubkey: string }) => {
  const { profile } = useGlobalProfile({ pubkey });

  return { profile };
};
