import { Resizable } from 're-resizable';

import { cn } from '@/shared/utils/cn';

import { useSidebar } from './hooks';

export const Sidebar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const {
    setIsCollapsed,
    sidebarWidth,
    setSidebarWidth,
    setHasCustomSidebarWidth,
    transition,
    setTransition,
    isMobile,
  } = useSidebar();

  return (
    <>
      <Resizable
        className={cn(
          'overflow-hidden border-r min-w-20 max-w-[70%]',
          transition && 'transition-all duration-75 ease-in-out',
          className,
        )}
        enable={{ right: !isMobile }}
        size={{ width: isMobile ? window.innerWidth : sidebarWidth }}
        onResizeStart={() => {
          if (!isMobile) setTransition(false);
        }}
        onResize={(_, __, ___, d) => {
          if (!isMobile) {
            const dWidth = d.width;
            const newWidth = sidebarWidth + dWidth;

            if (newWidth > 340) {
              setIsCollapsed(false);
            } else if (newWidth < 120) {
              setIsCollapsed(true);
            } else if (dWidth > 0 && newWidth > 120) {
              setIsCollapsed(false);
            } else if (dWidth < 0 && newWidth < 300) {
              setIsCollapsed(true);
            }
          }
        }}
        onResizeStop={(_, __, ___, d) => {
          if (!isMobile) {
            setTransition(true);
            setHasCustomSidebarWidth(true);

            const dWidth = d.width;
            const newWidth = sidebarWidth + dWidth;

            if (newWidth > 340) {
              setSidebarWidth(newWidth);
            } else {
              if (dWidth > 0 && dWidth > 40) {
                setSidebarWidth(340);
              } else if (dWidth < 0 && dWidth < -40) {
                setSidebarWidth(80);
              }
            }
          }
        }}
      >
        {children}
      </Resizable>
    </>
  );
};
