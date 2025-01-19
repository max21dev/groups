import { Filter } from 'lucide-react';

import { Button } from '@/shared/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu.tsx';

import { useGroupFilterDropDown } from './hooks';

export const GroupsFilterDropdown = () => {
  const { setBelongTo, setManage, setOwn, setNotJoined, groupsFilter, setBookmarked } =
    useGroupFilterDropDown();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>Show Groups that:</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={groupsFilter?.belongTo} onCheckedChange={setBelongTo}>
            I belong to
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={groupsFilter?.manage} onCheckedChange={setManage}>
            I manage
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            disabled={true}
            checked={groupsFilter?.own}
            onCheckedChange={setOwn}
          >
            I own
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={groupsFilter?.notJoined}
            onCheckedChange={setNotJoined}
          >
            I haven't joined
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={groupsFilter?.bookmarked}
            onCheckedChange={setBookmarked}
          >
            I have bookmarked
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
