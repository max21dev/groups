import { NostrEvent } from '@nostr-dev-kit/ndk';
import { AppWindowIcon, ExternalLinkIcon, OctagonAlertIcon } from 'lucide-react';

import { ellipsis } from '@/shared/utils';

import { useAppRecommendation } from './hooks';

export const AppRecommendation = ({ event }: { event: NostrEvent }) => {
  const { appData, isLoading, error } = useAppRecommendation(event);

  if (isLoading) {
    return <div className="animate-pulse">Loading app recommendation...</div>;
  }

  if (error || !appData) {
    return (
      <div className="flex items-center gap-1">
        <OctagonAlertIcon size={18} /> Failed to load app recommendation.
      </div>
    );
  }

  const { metadata, supportedKinds, platforms, categories } = appData;
  const isAppHandler = event.kind === 31990;
  const isRecommendation = event.kind === 31989;

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-3 p-2">
      <div className="flex flex-col justify-center gap-3">
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
          <h4 className="font-bold">
            {metadata.name || metadata.displayName || ellipsis(event.pubkey, 6)}
          </h4>
        </div>

        <div className="flex flex-col flex-1">
          {isAppHandler && (
            <>
              {metadata.website && (
                <a
                  href={metadata.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pink-400 hover:underline flex items-center"
                >
                  {metadata.website} <ExternalLinkIcon size={14} className="ml-1" />
                </a>
              )}

              {appData.sourceUrl && (
                <a
                  href={appData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pink-400 hover:underline flex items-center my-1"
                >
                  {appData.sourceUrl} <ExternalLinkIcon size={14} className="ml-1" />
                </a>
              )}

              {metadata.about && <p className="text-sm mt-1">{metadata.about}</p>}
            </>
          )}

          {isRecommendation && (
            <p className="text-sm">
              Recommends app for event kind:{' '}
              <span className="bg-primary/15 px-2 py-0.5 rounded-full text-xs">
                {supportedKinds[0] || 'Unknown'}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {isAppHandler && supportedKinds.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-1">Supported Event Kinds:</p>
            <div className="flex flex-wrap gap-1">
              {supportedKinds.map((kind, idx) => (
                <span key={idx} className="bg-sky-500 px-2 py-0.5 rounded-full text-xs">
                  {kind}
                </span>
              ))}
            </div>
          </div>
        )}

        {isAppHandler && categories.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-1">Categories:</p>
            <div className="flex flex-wrap gap-1">
              {categories.map((category, idx) => (
                <span key={idx} className="bg-primary/15 px-2 py-0.5 rounded-full text-xs">
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {Object.keys(platforms).length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-1">Available platforms:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(platforms).map(([platform], idx) => (
                <span key={idx} className="bg-sky-500 px-2 py-0.5 rounded-full text-xs">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
