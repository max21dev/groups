import { DialogDescription } from '@radix-ui/react-dialog';

import { Alert } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { PlusIcon } from 'lucide-react';

type RelayAddProps = {
  relayInput: string;
  setRelayInput: (value: string) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  error: string | null;
  handleAddNewRelay: () => void;
};

export const RelayAdd = ({
  relayInput,
  setRelayInput,
  dialogOpen,
  setDialogOpen,
  error,
  handleAddNewRelay,
}: RelayAddProps) => (
  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
    <DialogTrigger asChild>
      <Button variant="outline" className="w-full mt-2">
        <PlusIcon className="mr-2" />
        Add Relay URL
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Relay URL</DialogTitle>
        <DialogDescription>
          Please enter the URL of the new relay where you'd like to view the groups.
        </DialogDescription>
      </DialogHeader>
      <Input
        value={relayInput}
        onChange={(e) => setRelayInput(e.target.value)}
        placeholder="URL in format of wss:// , ws://"
      />
      {error && (
        <Alert variant="destructive" className="mt-2">
          {error}
        </Alert>
      )}
      <DialogFooter>
        <Button onClick={handleAddNewRelay}>Add</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
