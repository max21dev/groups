import { Outlet, createBrowserRouter } from 'react-router-dom';

import { UserLoginModal } from '@/features/users';

const Layout = () => {
  return (
    <>
      <Outlet />
      <UserLoginModal />
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
    ],
  },
]);
