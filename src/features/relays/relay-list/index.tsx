import { RelayWidget } from '@/features/relays';

import { useStore } from '@/shared/store';
import { cn } from '@/shared/utils';

export const RelayList = ({ className }: { className?: string }) => {
  const relays = useStore((state) => state.relays);

  return (
    <div
      className={cn(
        'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 m-4',
        className,
      )}
    >
      {relays && relays.map((relay) => <RelayWidget key={relay.url} relay={relay} />)}
    </div>
  );
};