import { useGlobalProfile } from '@/shared/hooks';

export const useUserInfoRow = ({ pubkey }: { pubkey: string | undefined }) => {
  const { profile } = useGlobalProfile({ pubkey });

  return { profile };
};
