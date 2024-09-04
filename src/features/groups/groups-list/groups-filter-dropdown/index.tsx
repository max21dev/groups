import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { Filter } from 'lucide-react';
import { useGroupFilterDropDown } from '@/features/groups/groups-list/groups-filter-dropdown/hooks';

export const GroupsFilterDropdown = () => {
  const { setBelongTo, setManage, setOwn, setNotJoined, groupsFilter, isCollapsed } =
    useGroupFilterDropDown();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            <Button variant="outline">
              <Filter />
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              {'Apply filter for Groups list'}
            </Button>
          )}
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
          <DropdownMenuCheckboxItem disabled={true} checked={groupsFilter?.own} onCheckedChange={setOwn}>
            I own
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={groupsFilter?.notJoined}
            onCheckedChange={setNotJoined}
          >
            I haven't joined
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
