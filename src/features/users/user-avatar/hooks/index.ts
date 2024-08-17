import { useGlobalProfile } from '@/shared/hooks';

export const useUserAvatar = ({ pubkey }: { pubkey: string }) => {
  const { profile } = useGlobalProfile({ pubkey });

  return { profile };
};
