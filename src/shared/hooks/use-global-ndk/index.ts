import { NDKSigner } from '@nostr-dev-kit/ndk';

import { useStore } from '@/shared/store';

export const useGlobalNdk = () => {
  const globalNdk = useStore((state) => state.globalNDK);
  const setGlobalNDK = useStore((state) => state.setGlobalNDK);

  const setGlobalSigner = (signer: NDKSigner | undefined) => {
    globalNdk.signer = signer;
    setGlobalNDK(globalNdk);
  };

  return { globalNdk, setGlobalNDK, setGlobalSigner };
};
