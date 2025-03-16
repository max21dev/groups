import { ArrowLeft, CheckIcon, Info, Share2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { GroupAvatar, GroupBookmark, GroupDetails } from '@/features/groups';

import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip.tsx';

import { cn } from '@/shared/utils';

import { useChatTopBar } from './hooks';

export const ChatTopBar = () => {
  const {
    metadata,
    isGroupDetailsOpen,
    toggleGroupDetails,
    activeGroupId,
    activeRelay,
    setActiveGroupId,
    copyToClipboard,
    hasCopied,
  } = useChatTopBar();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <ArrowLeft
            className="sm:hidden hover:cursor-pointer"
            onClick={() => setActiveGroupId(undefined)}
          />
          <GroupAvatar relay={activeRelay} groupId={activeGroupId} />
          <div className="flex flex-col">
            <span className="font-bold mt-0 mb-0">{metadata?.name}</span>
            <span className="text-xs font-light text-muted-foreground">
              {metadata?.isPublic ? 'Public' : 'Private'} and {metadata?.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GroupBookmark groupId={activeGroupId} groupName={metadata?.name} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/?relay=${activeRelay}&groupId=${activeGroupId}`,
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

      <div className="flex items-stretch divide-x">
        <NavLink
          to={`/?relay=${activeRelay}&groupId=${activeGroupId}`}
          end
          className={({ isActive }) =>
            cn(
              'py-1 px-4 text-xs font-medium border-y',
              isActive && '-mt-0.5 border-t-2 border-t-blue-500 border-b-0',
            )
          }
        >
          Chats
        </NavLink>
        <NavLink
          to={`/threads?relay=${activeRelay}&groupId=${activeGroupId}`}
          className={({ isActive }) =>
            cn(
              'py-1 px-4 text-xs font-medium border-y',
              isActive && '-mt-0.5 border-t-2 border-t-blue-500 border-b-0',
            )
          }
        >
          Threads
        </NavLink>
        <NavLink
          to={`/polls?relay=${activeRelay}&groupId=${activeGroupId}`}
          className={({ isActive }) =>
            cn(
              'py-1 px-4 text-xs font-medium border-y',
              isActive && '-mt-0.5 border-t-2 border-t-blue-500 border-b-0',
            )
          }
        >
          Polls
        </NavLink>
        <div className="flex-grow border-y"></div>
      </div>
    </div>
  );
};
