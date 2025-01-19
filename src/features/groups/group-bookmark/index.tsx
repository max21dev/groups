import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { BookmarkIcon } from 'lucide-react';

import { useGroupBookmark } from './hooks';

export const GroupBookmark = ({
  groupId,
  groupName,
}: {
  groupId: string | undefined;
  groupName?: string;
}) => {
  const { isBookmarked, addGroupToBookmarks, removeGroupFromBookmarks, activeUser } =
    useGroupBookmark(groupId, groupName);

  if (!activeUser) return null;

  return (
    <>
      {isBookmarked ? (
        <BookmarkFilledIcon
          className="cursor-pointer w-6 h-6"
          onClick={() => removeGroupFromBookmarks()}
        />
      ) : (
        <BookmarkIcon className="cursor-pointer" onClick={() => addGroupToBookmarks()} />
      )}
    </>
  );
};
