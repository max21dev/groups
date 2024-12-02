import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card.tsx';
import { Badge } from '@/shared/components/ui/badge.tsx';
import { useActiveRelay } from '@/shared/hooks';
import { Button } from '@/shared/components/ui/button.tsx';

export const RelayWidget = ({ relay }: { relay: { url: string; status: string } }) => {
  const { setActiveRelay } = useActiveRelay();
  return (
    <Card key={relay.url} className="shadow-md cursor-pointer"
          onClick={() => setActiveRelay(relay.url)}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{relay.url}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <Badge className={relay.url ? 'bg-green-500' : 'bg-red-500'}>
            {/*TODO: get online relay status*/}
            {/*{relay?.status} */ 'CONNECTED'}
          </Badge>
        </div>
        <div className="mt-2">
          <span>Groups: </span>
          <span className="font-medium">
            {/*TODO: get relay group number*/}
            Not Available
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <span>
            {/*TODO: get relay details*/}
            {'No additional details available.'}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant='outline'
          onClick={() => setActiveRelay(relay.url)}
        >
          Select as Active Relay
        </Button>
      </CardFooter>
    </Card>
  );
};
