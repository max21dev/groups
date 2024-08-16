import NDK from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { useAutoLogin, useNostrHooks } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/pages';

import { ThemeProvider } from '@/shared/components/theme-provider';
import { Toaster } from '@/shared/components/ui/toaster';

import { useGlobalNdk } from '@/shared/hooks';
import { useStore } from '@/shared/store';

import './index.css';

export const App = () => {
  const relays = useStore((state) => state.relays);
  const activeRelayIndex = useStore((state) => state.activeRelayIndex);

  const ndk = useMemo(
    () =>
      new NDK({
        explicitRelayUrls: [relays[activeRelayIndex]],
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
        cacheAdapter: new NDKCacheAdapterDexie({ dbName: `db-${relays[activeRelayIndex]}` }),
      }),
    [relays, activeRelayIndex],
  );

  useNostrHooks(ndk);

  const { globalNdk, setGlobalSigner } = useGlobalNdk();

  useEffect(() => {
    globalNdk.connect();
  }, [globalNdk]);

  useAutoLogin();

  useEffect(() => {
    setGlobalSigner(ndk.signer);
  }, [ndk.signer, setGlobalSigner]);

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </>
  );
};
