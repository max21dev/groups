import { NostrEvent } from '@nostr-dev-kit/ndk';
import { CheckIcon, Copy, ExternalLink, FolderGit, GitBranch } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { useCopyToClipboard } from '@/shared/hooks';

export const GitRepo = ({ event }: { event: NostrEvent }) => {
  const { copyToClipboard, hasCopied } = useCopyToClipboard();

  const repoIdTag = event.tags.find(([t]) => t === 'd');
  const repoId = repoIdTag ? repoIdTag[1] : 'unknown';

  const nameTag = event.tags.find(([t]) => t === 'name');
  const name = nameTag ? nameTag[1] : repoId;

  const descTag = event.tags.find(([t]) => t === 'description');
  const description = descTag ? descTag[1] : null;

  const webUrls = event.tags.filter(([t]) => t === 'web').map(([_, url]) => url);

  const cloneUrls = event.tags.filter(([t]) => t === 'clone').map(([_, url]) => url);

  const relayUrls = event.tags.filter(([t]) => t === 'relays').map(([_, url]) => url);

  const eucTag = event.tags.find(([t, _, marker]) => t === 'r' && marker === 'euc');
  const earliestUniqueCommit = eucTag ? eucTag[1] : null;

  const maintainers = event.tags.filter(([t]) => t === 'maintainers').map(([_, pubkey]) => pubkey);

  const tags = event.tags.filter(([t]) => t === 't').map(([_, tag]) => tag);

  return (
    <div className="w-full set-max-h flex flex-col gap-1 overflow-y-auto rounded-md p-2">
      <div className="flex flex-col w-full">
        <span className="flex items-center gap-2">
          <FolderGit size={20} />
          <h3 className="text-lg font-semibold">{name}</h3>
        </span>
        {description && <p className="text-sm mb-2">{description}</p>}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 my-1">
            {tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-primary/15 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {cloneUrls.length > 0 && (
          <div className="my-2">
            <h4 className="text-sm font-semibold mb-1">Clone</h4>
            {cloneUrls.map((url, i) => (
              <div key={i} className="flex items-center gap-1 mb-1">
                <Input value={url} className="border-primary focus-visible:ring-primary" readOnly />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="m-1 ms-auto bg-unset hover:bg-primary/15 text-current hover:text-current h-6 p-1"
                        onClick={() => copyToClipboard(url)}
                      >
                        {hasCopied ? (
                          <CheckIcon size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{hasCopied ? 'Copied!' : 'Copy URL'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        )}

        {webUrls.length > 0 && (
          <div className="my-1 w-fit">
            <h4 className="text-sm font-semibold mb-1">Web</h4>
            <div className="flex flex-col gap-1">
              {webUrls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 text-sm flex items-center gap-1 hover:underline"
                >
                  {url} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {earliestUniqueCommit && (
          <div className="flex items-center gap-1 text-xs my-1">
            <GitBranch size={15} />
            <span className="font-mono">{earliestUniqueCommit.substring(0, 8)}</span>
          </div>
        )}

        {(relayUrls.length > 0 || maintainers.length > 0) && (
          <div className="flex flex-col gap-1 mt-2 text-xs pt-2">
            {relayUrls.length > 0 && (
              <div>
                <span className="font-semibold">relays: </span>
                <span>{relayUrls.join(', ')}</span>
              </div>
            )}

            {maintainers.length > 0 && (
              <div>
                <span className="font-semibold">Maintainers: </span>
                <span>{maintainers.length} maintainer(s)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
