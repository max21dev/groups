import { cn, ellipsis } from '@/shared/utils';

import { useNotePreview } from './hooks';

export const NotePreview = ({
                              note,
                              sameAsCurrentUser,
                            }: {
  note: string;
  sameAsCurrentUser: boolean;
}) => {
  const { event, profile, link } = useNotePreview(note);

  return (
    <>
      {event ? (
        <div className="flex items-center gap-4 p-2 text-sm bg-black dark:bg-white bg-opacity-15 dark:bg-opacity-15 rounded-md">
          <div className="space-y-1">
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
                primal.net
              </a>
            )}
            <p className={cn('font-bold', sameAsCurrentUser ? 'text-blue-200' : 'text-gray-500')}>
              {profile?.displayName || profile?.name || profile?.nip05}
            </p>
            <p>{ellipsis(event.content, 33)}</p>
          </div>
          <img src={profile?.image} className="h-16 w-16 rounded-md" alt="" />
        </div>
      ) : (
        <span>{note}</span>
      )}
    </>
  );
};