import {
  Bitcoin,
  Landmark,
  Loader2,
  PackagePlus,
  Plus,
  RadioIcon,
  Trash2,
  Wallet,
} from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

import { useCreateCashuWallet } from './hooks';

export const CreateCashuWallet = () => {
  const {
    isOpen,
    setIsOpen,
    isCreating,
    mintInput,
    setMintInput,
    relayInput,
    setRelayInput,
    selectedMints,
    selectedRelays,
    availableRelays,
    handleAddMint,
    handleAddRelay,
    toggleRelay,
    removeMint,
    handleCreateWallet,
    resetForm,
  } = useCreateCashuWallet();

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary/80">
          <Wallet className="mr-2 h-4 w-4" />
          Create Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Cashu Wallet</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1">
              <Landmark className="h-4 w-4" />
              Mints
            </Label>
            <p className="text-xs text-muted-foreground">
              Add Cashu mints to use with your wallet. You need at least one mint.
            </p>

            {selectedMints.length > 0 && (
              <ScrollArea className="h-24 border rounded-md p-2">
                {selectedMints.map((mint, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1 px-2 hover:bg-secondary/50 rounded"
                  >
                    <span className="text-sm truncate">{mint}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeMint(mint)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            )}

            <div className="flex gap-2">
              <Input
                value={mintInput}
                onChange={(e) => setMintInput(e.target.value)}
                placeholder="https://mint.example.com"
                className="flex-1"
              />
              <Button
                onClick={handleAddMint}
                disabled={!mintInput.trim() || !mintInput.startsWith('https://')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1">
              <RadioIcon className="h-4 w-4" />
              Relays
            </Label>
            <p className="text-xs text-muted-foreground">
              Select relays to use with your wallet. Discovery relays are preselected.
            </p>

            <ScrollArea className="h-32 border rounded-md p-2">
              {availableRelays.map((relay, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 py-1 px-2 hover:bg-secondary/50 rounded cursor-pointer ${
                    selectedRelays.includes(relay) ? 'bg-secondary/30' : ''
                  }`}
                  onClick={() => toggleRelay(relay)}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedRelays.includes(relay) ? 'bg-primary' : 'border border-primary'
                    }`}
                  />
                  <span className="text-sm truncate">{new URL(relay).hostname}</span>
                </div>
              ))}
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={relayInput}
                onChange={(e) => setRelayInput(e.target.value)}
                placeholder="wss://relay.example.com"
                className="flex-1"
              />
              <Button
                onClick={handleAddRelay}
                disabled={!relayInput.trim() || !relayInput.startsWith('wss://')}
              >
                <PackagePlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateWallet}
            disabled={isCreating || selectedMints.length === 0 || selectedRelays.length === 0}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Bitcoin className="h-4 w-4 mr-2" />
            )}
            Create Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
