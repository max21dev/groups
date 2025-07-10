import { CompassIcon, LayoutGridIcon, SearchIcon } from 'lucide-react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GroupsSearch } from '@/features/groups';
import { useHomePage } from '@/pages/home/hooks';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useActiveRelay } from '@/shared/hooks';
import { cn } from '@/shared/utils';

export const RelayDiscoverDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isCollapsed, isMobile } = useHomePage();
  const { activeRelay } = useActiveRelay();
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn('p-2', isCollapsed && !isMobile && 'w-full')}
          >
            <LayoutGridIcon className="cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="p-1">
            <Button
              variant="ghost"
              className="w-full p-2 flex items-center justify-start gap-2"
              onClick={() => setIsOpen(true)}
            >
              <SearchIcon size={16} /> Search Groups
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-1">
            <Button
              variant="ghost"
              className="w-full p-2 flex items-center justify-start gap-2"
              onClick={() => navigate(`/explore?relay=${activeRelay}`)}
            >
              <CompassIcon size={16} /> Explore Relay
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <GroupsSearch isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
