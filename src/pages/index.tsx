import NDK, { NDKRelayAuthPolicies } from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { useLogin, useSigner } from 'nostr-hooks';
import { useEffect } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';

import { useActiveRelay, useGlobalNdk, useNip29Ndk } from '@/shared/hooks';
import { useStore } from '@/shared/store';

const Layout = () => {
  const setRelayStatus = useStore((state) => state.setRelayStatus);

  const { activeRelay } = useActiveRelay();

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

  const removeTrailingSlash = (url: string): string => (url.endsWith('/') ? url.slice(0, -1) : url);

  const handleRelayStatus = (status: string) => (relay: { url: string }) => {
    const relayUrl = removeTrailingSlash(relay.url);
    setRelayStatus(relayUrl, status);
    console.log(`${status} to relay`, relayUrl);
  };

  useEffect(() => {
    globalNdk.connect();
  }, [globalNdk]);

  useEffect(() => {
    nip29Ndk.connect();

    const pool = nip29Ndk.pool;
    if (pool) {
      pool.on('relay:connecting', handleRelayStatus('CONNECTING'));
      pool.on('relay:connect', handleRelayStatus('CONNECTED'));
      pool.on('relay:disconnect', handleRelayStatus('DISCONNECTED'));
    }
  }, [nip29Ndk]);

  useEffect(() => {
    if (!activeRelay) {
      return;
    }

    const ndk = new NDK({
      explicitRelayUrls: [activeRelay],
      autoConnectUserRelays: false,
      autoFetchUserMutelist: false,
      cacheAdapter: new NDKCacheAdapterDexie({ dbName: `db-${activeRelay}` }),
      signer: globalNdk.signer,
      relayAuthDefaultPolicy: undefined, // Placeholder for now, we'll set it after initialization
    });

    ndk.relayAuthDefaultPolicy = NDKRelayAuthPolicies.signIn({ ndk, signer: globalNdk.signer });
    setNip29Ndk(ndk);
  }, [activeRelay, globalNdk.signer, setNip29Ndk]);

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
      <Outlet />
    </>
  );
};

const HomePage = () => import('@/pages/home');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        async lazy() {
          return { Component: (await HomePage()).HomePage };
        },
      },
      {
        path: '/:relay',
        async lazy() {
          return { Component: (await HomePage()).HomePage };
        },
      },
      {
        path: '/:relay/:groupId',
        async lazy() {
          return { Component: (await HomePage()).HomePage };
        },
      },
    ],
  },
]);
