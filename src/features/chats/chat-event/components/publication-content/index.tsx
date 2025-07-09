import { FileText } from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';

import { AsciidocRenderer } from '@/shared/components/asciidoc';

export const PublicationContent = ({ event }: { event: NostrEvent }) => {
  const title = event.tags.find((tag) => tag[0] === 'title')?.[1] || 'Untitled Section';
  const content = event.content || '';

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2 mb-2">
        <FileText size={20} className="text-primary" />
        <h4 className="text-lg font-bold leading-tight">{title}</h4>
      </div>

      {content ? (
        <AsciidocRenderer content={content} />
      ) : (
        <div className="text-center text-sm text-muted-foreground bg-secondary/50 rounded-lg p-4">
          <FileText size={24} className="mx-auto mb-2 opacity-50" />
          No content available for this section
        </div>
      )}
    </div>
  );
};
