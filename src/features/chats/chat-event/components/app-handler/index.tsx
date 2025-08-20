import { NostrEvent } from '@nostr-dev-kit/ndk';
import { AppWindowIcon, ExternalLinkIcon } from 'lucide-react';

import { ellipsis } from '@/shared/utils';

import { useAppHandler } from './hooks';

export const AppHandler = ({ event }: { event: NostrEvent }) => {
  const { data, loading, error } = useAppHandler(event);

  if (loading) return <div className="animate-pulse">Loading app handler…</div>;

  if (error || !data) return <div className="text-sm text-red-400">Failed to load handler.</div>;

  const { metadata, supportedKinds, categories, sourceUrl } = data;

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <div className="flex items-center gap-3">
        {metadata.picture ? (
          <img
            src={metadata.picture}
            alt="App Logo"
            className="h-14 w-14 rounded-full bg-primary/15 object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center">
            <AppWindowIcon size={20} />
          </div>
        )}
        <div className="flex flex-col">
          <h4 className="font-bold">
            {metadata.name || metadata.displayName || ellipsis(event.pubkey, 6)}
          </h4>

          {metadata.website && (
            <a
              href={metadata.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-pink-400 hover:underline flex items-center"
            >
              {metadata.website} <ExternalLinkIcon size={14} className="ml-1" />
            </a>
          )}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-pink-400 hover:underline flex items-center"
            >
              {sourceUrl} <ExternalLinkIcon size={14} className="ml-1" />
            </a>
          )}
        </div>
      </div>

      {metadata.about && <p className="text-sm">{metadata.about}</p>}

      {supportedKinds.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-1">Supported kinds</p>
          <div className="flex flex-wrap gap-1">
            {supportedKinds.map((k, i) => (
              <span key={i} className="bg-sky-500 px-2 py-0.5 rounded-full text-xs">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-1">Categories</p>
          <div className="flex flex-wrap gap-1">
            {categories.map((c, i) => (
              <span key={i} className="bg-primary/15 px-2 py-0.5 rounded-full text-xs">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
