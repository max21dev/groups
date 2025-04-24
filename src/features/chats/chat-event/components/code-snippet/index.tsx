import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { Markdown } from '@/shared/components/markdown';

export const CodeSnippet = ({ event }: { event: NDKEvent }) => {
  const codeContent = event.content || '';

  const languageTag = event.tags.find(([t]) => t === 'l');
  const language = languageTag ? languageTag[1] : 'plaintext';

  const nameTag = event.tags.find(([t]) => t === 'name');
  const fileName = nameTag ? nameTag[1] : null;

  const descTag = event.tags.find(([t]) => t === 'description');
  const description = descTag ? descTag[1] : null;

  const runtimeTag = event.tags.find(([t]) => t === 'runtime');
  const runtime = runtimeTag ? runtimeTag[1] : null;

  const licenseTag = event.tags.find(([t]) => t === 'license');
  const license = licenseTag ? licenseTag[1] : null;

  const repoTag = event.tags.find(([t]) => t === 'repo');
  const repo = repoTag ? repoTag[1] : null;

  const depTags = event.tags.filter(([t]) => t === 'dep').map(([_, value]) => value);

  const formattedCode = useMemo(() => {
    return `\`\`\`${language}\n${codeContent}\n\`\`\``;
  }, [codeContent, language]);

  return (
    <div className="w-full set-max-h flex flex-col gap-1 overflow-y-auto">
      {fileName && <h3 className="text-lg font-mono font-semibold">{fileName}</h3>}

      {description && <p className="text-sm mb-2">{description}</p>}

      <div className="w-full rounded-md">
        <Markdown content={formattedCode} className="[&_pre]:m-0 [&_*]:max-w-full" />
      </div>

      {(runtime || license || !!depTags.length) && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {runtime && (
            <div className="flex gap-1 items-center">
              <span className="font-semibold">Runtime:</span>
              <span>{runtime}</span>
            </div>
          )}

          {license && (
            <div className="flex gap-1 items-center">
              <span className="font-semibold">License:</span>
              <span>{license}</span>
            </div>
          )}

          {depTags.length > 0 && (
            <div className="flex gap-1 items-center">
              <span className="font-semibold">Dependencies:</span>
              <span>{depTags.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {repo && (
        <div className="mt-1 text-xs">
          <span className="font-semibold">Repository: </span>
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 underline"
          >
            {repo}
          </a>
        </div>
      )}
    </div>
  );
};
