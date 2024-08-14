import { useEffect, useState } from 'react';

import { useStore } from '@/shared/store';

export const useSidebar = () => {
  const [transition, setTransition] = useState(false);

  const isGroupDetailsOpen = useStore((state) => state.isGroupDetailsOpen);
  const sidebarWidth = useStore((state) => state.sidebarWidth);
  const isCollapsed = useStore((state) => state.isCollapsed);
  const hasCustomSidebarWidth = useStore((state) => state.hasCustomSidebarWidth);
  const setHasCustomSidebarWidth = useStore((state) => state.setHasCustomSidebarWidth);
  const setSidebarWidth = useStore((state) => state.setSidebarWidth);
  const setIsCollapsed = useStore((state) => state.setIsCollapsed);

  useEffect(() => {
    const checkScreenWidth = () => {
      if (hasCustomSidebarWidth) return;

      // Set the sidebar width based on the screen width if the user hasn't set a custom width
      setIsCollapsed(window.innerWidth <= 768);
      setSidebarWidth(window.innerWidth <= 768 ? 80 : 340);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return {
    transition,
    setTransition,
    isCollapsed,
    setIsCollapsed,
    isGroupDetailsOpen,
    setSidebarWidth,
    sidebarWidth,
    setHasCustomSidebarWidth,
  };
};
