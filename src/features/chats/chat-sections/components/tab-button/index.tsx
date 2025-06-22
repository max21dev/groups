import { cn } from '@/shared/utils';

export const TabButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'py-1 px-4 text-xs font-medium border-y',
      isActive && '-mt-0.5 border-t-2 border-t-blue-500 border-b-0',
    )}
  >
    {children}
  </button>
);
