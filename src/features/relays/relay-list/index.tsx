import { useStore } from '@/shared/store';
import { RelayWidget } from '@/features/relays/relay-widget';


export const RelayList = () => {
  const relays = useStore((state) => state.relays);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {relays && relays.map((relay) => (
        <RelayWidget key={relay.url} relay={relay} />
      ))}
    </div>
  );
};