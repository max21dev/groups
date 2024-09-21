import NDK, { NDKRelayAuthPolicies } from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { useLogin, useSigner } from 'nostr-hooks';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/pages';

import { ThemeProvider } from '@/shared/components/theme-provider';
import { Toaster } from '@/shared/components/ui/toaster';

import { useGlobalNdk, useNip29Ndk } from '@/shared/hooks';
import { useStore } from '@/shared/store';

import './index.css';

export const App = () => {
  const relays = useStore((state) => state.relays);
  const activeRelayIndex = useStore((state) => state.activeRelayIndex);

  const { globalNdk, setGlobalNdk } = useGlobalNdk();
  const { nip29Ndk, setNip29Ndk } = useNip29Ndk();

  const { setSigner: setGlobalSigner } = useSigner({
    customNdk: globalNdk,
    setCustomNdk: setGlobalNdk,
  });
  const { setSigner: setNip29Signer } = useSigner({
    customNdk: nip29Ndk,
    setCustomNdk: setNip29Ndk,
  });

  const { loginFromLocalStorage } = useLogin({ customNdk: globalNdk, setCustomNdk: setGlobalNdk });

  useEffect(() => {
    globalNdk.connect();
  }, [globalNdk]);

  useEffect(() => {
    nip29Ndk.connect();
  }, [nip29Ndk]);

  useEffect(() => {
    const ndk = new NDK({
      explicitRelayUrls: [relays[activeRelayIndex]],
      autoConnectUserRelays: false,
      autoFetchUserMutelist: false,
      cacheAdapter: new NDKCacheAdapterDexie({ dbName: `db-${relays[activeRelayIndex]}` }),
      signer: globalNdk.signer,
      relayAuthDefaultPolicy: undefined, // Placeholder for now, we'll set it after initialization
    });

    ndk.relayAuthDefaultPolicy = NDKRelayAuthPolicies.signIn({ ndk, signer: globalNdk.signer });

    setNip29Ndk(ndk);
  }, [relays, activeRelayIndex, globalNdk.signer]);

  useEffect(() => {
    loginFromLocalStorage({
      onSuccess: (signer) => {
        setGlobalSigner(signer);
        setNip29Signer(signer);
      },
    });
  }, [loginFromLocalStorage, setGlobalSigner, setNip29Signer]);

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </>
  );
};
