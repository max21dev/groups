import { Globe, TrashIcon } from 'lucide-react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';

import { useRelaySelectDropDown } from './hooks';
import { DialogDescription } from '@radix-ui/react-dialog';

export const RelaySelectDropdown = () => {
  const {
    relayInput,
    setRelayInput,
    dialogOpen,
    setDialogOpen,
    error,
    relays,
    activeRelayIndex,
    handleAddNewRelay,
    handleDeleteRelay,
    isCollapsed,
    setActiveRelayIndex,
    setActiveGroupId,
  } = useRelaySelectDropDown();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            <Button variant="outline">
              <Globe />
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              {relays[activeRelayIndex]}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>Select a relay</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={activeRelayIndex.toString()}
            onValueChange={(value) => {
              setActiveRelayIndex(+value);
              setActiveGroupId(undefined);
            }}
          >
            {relays.map((relay, index) => (
              <DropdownMenuRadioItem
                key={relay}
                value={index.toString()}
                className="flex justify-between items-center"
              >
                <span>{relay}</span>
                {relay !== 'wss://groups.fiatjaf.com' && (
                  <Button
                    className="z-10"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRelay(relay);
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-2">
                Add New Relay URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Relay URL</DialogTitle>
                <DialogDescription>Please enter the URL of the new relay where you'd like to view the groups.</DialogDescription>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
