import { Info, Loader2 } from 'lucide-react';

import { GroupAvatar, GroupDetails } from '@/features/groups';

import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';

import { useChatTopBar } from './hooks';

export const ChatTopBar = () => {
  const { group, isGroupDetailsOpen, status, toggleGroupDetails, activeGroupId } = useChatTopBar();

  return (
    <div className="w-full border-b">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          {status == 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
          {status == 'success' && (
            <>
              <GroupAvatar groupId={activeGroupId} />

              <div className="flex flex-col">
                <span className="font-light text-xs">{group?.id}</span>
                <span className="font-bold mt-0 mb-0">{group?.name}</span>
                <span className="text-xs">
                  {group?.privacy} and {group?.type}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Sheet onOpenChange={() => toggleGroupDetails()}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full lg:max-w-screen-md">
              {isGroupDetailsOpen && activeGroupId && (
                <div className="grid gap-4 py-4">
                  <GroupDetails groupId={activeGroupId} />
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* <div className="p-2 border-t"></div> */}
    </div>
  );
};
