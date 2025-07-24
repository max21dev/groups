import { ListFilter } from 'lucide-react';

import { ChatEvent } from '@/features/chats';
import { EVENT_CATEGORY_MAP } from '@/features/chats/chat-event/utils';

import { Spinner } from '@/shared/components/spinner';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Switch } from '@/shared/components/ui/switch';
import { getNostrLink } from '@/shared/utils';

import { useUserActivity } from './hooks';

export const UserActivity = ({ pubkey }: { pubkey: string }) => {
  const {
    events,
    isInitialLoading,
    isSubscriptionActive,
    selectedKinds,
    tempSelectedKinds,
    isPopoverOpen,
    handleSubscriptionToggle,
    handleTempKindToggle,
    handlePopoverOpenChange,
    handleCancelFilters,
    handleApplyFilters,
  } = useUserActivity(pubkey);

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-2 h-full overflow-y-auto">
      <div className="w-full max-w-2xl flex items-center justify-between my-2">
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ListFilter size={16} />
              Kinds ({selectedKinds.length})
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-96 overflow-y-auto">
            <h4 className="font-medium mb-2">Select Event Kinds</h4>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(EVENT_CATEGORY_MAP).map(([kind, category]) => (
                <div key={kind} className="flex items-center space-x-2">
                  <Checkbox
                    id={`kind-${kind}`}
                    checked={tempSelectedKinds.includes(Number(kind))}
                    onCheckedChange={(checked) =>
                      handleTempKindToggle(Number(kind), checked as boolean)
                    }
                    disabled={
                      tempSelectedKinds.length === 1 && tempSelectedKinds.includes(Number(kind))
                    }
                  />
                  <label
                    htmlFor={`kind-${kind}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category} (kind {kind})
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 mt-2 border-t">
              <Button variant="outline" size="sm" onClick={handleCancelFilters}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Updates</span>
          <Switch checked={isSubscriptionActive} onCheckedChange={handleSubscriptionToggle} />
        </div>
      </div>

      {events.length === 0 ? (
        <p className="flex justify-center items-center flex-1 text-muted-foreground">
          No activity found for this user
        </p>
      ) : (
        <>
          {events.map((event) => (
            <ChatEvent
              key={event.id}
              event={getNostrLink(event.id!, event.pubkey, event.kind) || event.id!}
            />
          ))}
        </>
      )}
    </div>
  );
};
