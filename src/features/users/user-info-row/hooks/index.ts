import { useGlobalProfile } from '@/shared/hooks';

export const useUserInfoRow = ({ pubkey }: { pubkey: string }) => {
  const { profile } = useGlobalProfile({ pubkey });

  return { profile };
};
