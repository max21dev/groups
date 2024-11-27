import { useEffect } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';

import { useLogin, useNdk } from 'nostr-hooks';

const Layout = () => {
  // const setRelayStatus = useStore((state) => state.setRelayStatus);

  // const { activeRelay } = useActiveRelay();

  const { initNdk, ndk } = useNdk();
  const { loginFromLocalStorage } = useLogin();

  // const removeTrailingSlash = (url: string): string => (url.endsWith('/') ? url.slice(0, -1) : url);

  // const handleRelayStatus = (status: string) => (relay: { url: string }) => {
  //   const relayUrl = removeTrailingSlash(relay.url);
  //   setRelayStatus(relayUrl, status);
  //   console.log(`${status} to relay`, relayUrl);
  // };

  useEffect(() => {
    ndk?.connect();
  }, [ndk]);

  useEffect(() => {
    // if (!activeRelay) return;

    initNdk({
      explicitRelayUrls: ['wss://relay.primal.net'],
      autoConnectUserRelays: true,
      autoFetchUserMutelist: false,
      // signer: globalNdk?.signer,
      // cacheAdapter: new NDKCacheAdapterDexie({ dbName: `ndk-db` }),
      // relayAuthDefaultPolicy: NDKRelayAuthPolicies.signIn({ signer: globalNdk?.signer }),
    });
  }, [initNdk]);

  // useEffect(() => {
  //   nip29Ndk?.connect();

  //   const pool = nip29Ndk?.pool;
  //   if (pool) {
  //     pool.on('relay:connecting', handleRelayStatus('CONNECTING'));
  //     pool.on('relay:connect', () => handleRelayStatus('CONNECTED'));
  //     pool.on('relay:disconnect', handleRelayStatus('DISCONNECTED'));
  //   }
  // }, [nip29Ndk]);

  useEffect(() => {
    loginFromLocalStorage();
  }, [loginFromLocalStorage]);

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
