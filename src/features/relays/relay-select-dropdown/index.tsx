import { RelayAdd } from '@/features/relays';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Globe, TrashIcon } from 'lucide-react';

import { MANDATORY_RELAYS } from './config';
import { useRelaySelectDropDown } from './hooks';

export const RelaySelectDropdown = () => {
  const {
    relayInput,
    setRelayInput,
    dialogOpen,
    setDialogOpen,
    error,
    relays,
    activeRelay,
    handleAddNewRelay,
    handleDeleteRelay,
    isCollapsed,
    setActiveRelay,
    isMobile,
  } = useRelaySelectDropDown();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed && !isMobile ? (
            <Button variant="outline">
              <Globe />
            </Button>
          ) : (
            <Button variant="outline" className="w-full text-xs font-light">
              {activeRelay?.replace('wss://', '') || 'Select a relay'}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>Select a relay</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={activeRelay?.toString()}
            onValueChange={(value) => {
              setActiveRelay(value);
            }}
          >
            {relays.map((relay) => (
              <DropdownMenuRadioItem
                key={relay.url}
                value={relay.url}
                className="flex justify-between items-center"
              >
                <span>{relay.url}</span>
                {!MANDATORY_RELAYS.includes(relay.url) && (
                  <Button
                    className="z-10"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRelay(relay.url);
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <RelayAdd
            relayInput={relayInput}
            setRelayInput={setRelayInput}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            error={error}
            handleAddNewRelay={handleAddNewRelay}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
