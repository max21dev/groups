import { useProfile } from '@/shared/hooks';

export const useUserInfoRow = ({ pubkey }: { pubkey: string }) => {
  const { profile } = useProfile({ pubkey: pubkey });

  return { profile };
};
