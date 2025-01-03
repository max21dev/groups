import { ArrowLeft, CheckIcon, Info, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { GroupAvatar, GroupDetails } from '@/features/groups';

import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';

import { useChatTopBar } from './hooks';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip.tsx';

export const ChatTopBar = () => {
  const {
    metadata,
    isGroupDetailsOpen,
    toggleGroupDetails,
    activeGroupId,
    activeRelay,
    copyToClipboard,
    hasCopied,
  } = useChatTopBar();

  const navigate = useNavigate();

  return (
    <div className="w-full border-b">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <ArrowLeft
            className="sm:hidden hover:cursor-pointer"
            onClick={() => navigate(`/relay/${activeRelay?.replace(/^wss:\/\//, '')}`)}
          />
          <GroupAvatar relay={activeRelay} groupId={activeGroupId} />
          <div className="flex flex-col">
            {/* <span className="font-light text-xs">{group?.id}</span> */}
            <span className="font-bold mt-0 mb-0">{metadata?.name}</span>
            <span className="text-xs font-light text-muted-foreground">
              {metadata?.isPublic ? 'Public' : 'Private'} and {metadata?.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/relay/${activeRelay?.replace('wss://', '')}/group/${activeGroupId}`,
                    )
                  }
                >
                  {hasCopied ? (
                    <CheckIcon size={25} className="text-green-600" />
                  ) : (
                    <Share2 size={25} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasCopied ? 'Link Copied' : 'Copy Group Link To Share'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Sheet onOpenChange={() => toggleGroupDetails()}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info size={25} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full lg:max-w-screen-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle />
                <SheetDescription />
              </SheetHeader>
              {isGroupDetailsOpen && activeGroupId && (
                <div className="grid gap-4 py-4">
                  <GroupDetails relay={activeRelay} groupId={activeGroupId} />
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
