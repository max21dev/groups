import { RelayAdd, RelayWidget } from '@/features/relays';
import { useRelaySelectDropDown } from '@/features/relays/relay-select-dropdown/hooks';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card.tsx';

import { useStore } from '@/shared/store';
import { cn } from '@/shared/utils';

export const RelayList = ({ className }: { className?: string }) => {
  const relays = useStore((state) => state.relays);

  const { relayInput, setRelayInput, dialogOpen, setDialogOpen, error, handleAddNewRelay } =
    useRelaySelectDropDown();

  return (
    <div
      className={cn(
        'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 m-4',
        className,
      )}
    >
      {relays && relays.map((relay) => <RelayWidget key={relay.url} relay={relay} />)}

      <Card className="shadow-md cursor-default">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Add New Relay</CardTitle>
        </CardHeader>
        <CardContent>Easily manage your groups in New Relay by including them in the list.</CardContent>
        <CardFooter>
          <RelayAdd
            relayInput={relayInput}
            setRelayInput={setRelayInput}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            error={error}
            handleAddNewRelay={handleAddNewRelay}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
