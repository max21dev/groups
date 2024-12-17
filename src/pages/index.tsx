import { useLogin, useNdk } from 'nostr-hooks';
import { useEffect } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';

import { useActiveRelay } from '@/shared/hooks';

const Layout = () => {
  const { ndk, initNdk } = useNdk();
  const { loginFromLocalStorage } = useLogin();

  const { activeRelay } = useActiveRelay();

  useEffect(() => {
    ndk?.connect();
  }, [ndk]);

  useEffect(() => {
    const explicitRelayUrls = ['wss://relay.primal.net'];
    activeRelay && explicitRelayUrls.push(activeRelay);

    initNdk({ explicitRelayUrls }, true);
  }, [initNdk, activeRelay]);

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
