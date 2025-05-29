import { BookOpen } from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';

import { AsciidocRenderer } from '@/shared/components/asciidoc';

export const Wiki = ({ event }: { event: NostrEvent }) => {
  const articleTitle = event.tags.find((tag) => tag[0] === 'title')?.[1] || 'Untitled Article';
  const articleSummary = event.tags.find((tag) => tag[0] === 'summary')?.[1];
  const coverImage = event.tags.find((tag) => tag[0] === 'image')?.[1];

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      {coverImage && (
        <img
          src={coverImage}
          alt={articleTitle || 'Wiki Article'}
          className="aspect-auto max-h-56 rounded-lg mx-auto my-2"
        />
      )}

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            <span className="text-xs font-medium uppercase tracking-wide">Wiki Article</span>
          </div>
          <h4 className="text-lg font-bold leading-tight">{articleTitle}</h4>
        </div>

        {articleSummary && (
          <div className="px-2 py-1 border-l-2 border-primary/40 text-sm opacity-85 line-clamp-4">
            {articleSummary}
          </div>
        )}

        <AsciidocRenderer content={event.content || ''} />
      </div>
    </div>
  );
};
