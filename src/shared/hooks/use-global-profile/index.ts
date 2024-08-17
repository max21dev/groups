import { useProfile } from 'nostr-hooks';
import { useMemo } from 'react';

import { useGlobalNdk } from '@/shared/hooks';

export const useGlobalProfile = ({ pubkey }: { pubkey: string | undefined }) => {
  const { globalNdk } = useGlobalNdk();

  const { profile } = useProfile(
    useMemo(() => (pubkey ? { pubkey } : undefined), [pubkey]),
    globalNdk,
  );

  return { profile };
};
