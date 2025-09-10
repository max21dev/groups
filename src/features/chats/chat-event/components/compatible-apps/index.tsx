import { ExternalLink } from 'lucide-react';

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { ellipsis } from '@/shared/utils';

import { useCompatibleApps } from './hooks';

export const CompatibleApps = ({ eventId, eventKind }: { eventId: string; eventKind?: number }) => {
  const { apps, isLoading } = useCompatibleApps(eventId, eventKind);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2">
        <ExternalLink size={18} />
        Open with...
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent>
        {isLoading ? (
          <DropdownMenuItem disabled>Loading apps...</DropdownMenuItem>
        ) : apps.length === 0 ? (
          <DropdownMenuItem disabled>No apps found.</DropdownMenuItem>
        ) : (
          <ScrollArea viewportProps={{ className: 'max-h-[60vh]' }}>
            {apps.map((app, index) => (
              <DropdownMenuItem key={`${app.id}-${index}`} asChild>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  {app.picture ? (
                    <img src={app.picture} alt={app.name} className="w-4 h-4 rounded-full" />
                  ) : (
                    <ExternalLink size={14} />
                  )}
                  {ellipsis(app.name, 12)}
                </a>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
