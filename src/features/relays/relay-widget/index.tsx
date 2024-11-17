import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card.tsx';
import { Badge } from '@/shared/components/ui/badge.tsx';
import { useActiveRelay } from '@/shared/hooks';

export const RelayWidget = ({ relay }: { relay: { url: string; status: string } }) => {
  const { setActiveRelay } = useActiveRelay();
  return (
    <Card key={relay.url} className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{relay.url}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <Badge className={relay.url ? 'bg-green-500' : 'bg-red-500'}>
            {/*TODO: get online relay status*/}
            {relay?.status}
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
        <button
          onClick={() => setActiveRelay(relay.url)}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Select as Active Relay
        </button>
      </CardFooter>
    </Card>
  );
};
