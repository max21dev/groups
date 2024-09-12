import { useStore } from '@/shared/store';

export const useGroupFilterDropDown = () => {
  const groupsFilter = useStore((state) => state.groupsFilter);
  const setGroupsFilter = useStore((state) => state.setGroupsFilter);
  const isCollapsed = useStore((state) => state.isCollapsed);
  const setBelongTo = (belongTo: boolean) => {
    setGroupsFilter({ ...groupsFilter, belongTo });
  };
  const setManage = (manage: boolean) => {
    setGroupsFilter({ ...groupsFilter, manage });
  };
  const setOwn = (own: boolean) => {
    setGroupsFilter({ ...groupsFilter, own });
  };
  const setNotJoined = (notJoined: boolean) => {
    setGroupsFilter({ ...groupsFilter, notJoined });
  };

  return {
    groupsFilter,
    setGroupsFilter,
    isCollapsed,
    setBelongTo,
    setManage,
    setOwn,
    setNotJoined,
  };
};
