import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/shared/components/ui/toaster';

import { ThemeProvider } from '@/shared/components/theme-provider';

import { router } from '@/pages';

import './index.css';

export const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
};
