import { useEffect } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';

import { useLogin, useNdk } from 'nostr-hooks';

const Layout = () => {
  const { ndk, initNdk } = useNdk();
  const { loginFromLocalStorage } = useLogin();

  useEffect(() => {
    ndk?.connect();
  }, [ndk]);

  useEffect(() => {
    initNdk({
      explicitRelayUrls: ['wss://relay.primal.net'],
      autoConnectUserRelays: true,
      autoFetchUserMutelist: false,
      // cacheAdapter: new NDKCacheAdapterDexie({ dbName: `ndk-db` }),
    });
  }, [initNdk]);

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
const UserPage = () => import('@/pages/user');

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
        path: '/user/:user',
        async lazy() {
          return { Component: (await UserPage()).UserPage };
        },
      },
      {
        path: '/relay/:relay',
        async lazy() {
          return { Component: (await HomePage()).HomePage };
        },
      },
      {
        path: '/relay/:relay/group/:groupId',
        async lazy() {
          return { Component: (await HomePage()).HomePage };
        },
      },
    ],
  },
]);
