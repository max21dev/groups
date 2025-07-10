import { ChevronRight } from 'lucide-react';

import { NDKEvent } from '@nostr-dev-kit/ndk';

export const SectionPreview = ({
  section,
  index,
  onClick,
}: {
  section: NDKEvent;
  index: number;
  onClick: () => void;
}) => {
  const title = section.tags.find((tag) => tag[0] === 'title')?.[1] || `Section ${index}`;
  const isSubIndex = section.kind === 30040;

  return (
    <div
      className="flex items-center justify-between p-2 rounded-lg bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono bg-primary/20 px-2 py-1 min-w-8 text-center rounded">
          {index}
        </span>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{title}</span>
          <span className="text-xs text-primary/50">
            {isSubIndex ? 'Sub-publication' : 'Content section'}
          </span>
        </div>
      </div>
      <ChevronRight size={16} className="text-muted-foreground" />
    </div>
  );
};
