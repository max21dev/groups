import { Book, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';

import { RichText } from '@/shared/components/rich-text';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { SectionPreview, SectionRenderer } from './components';
import { usePublicationIndex } from './hooks';

export const PublicationIndex = ({ event }: { event: NostrEvent }) => {
  const {
    sections,
    isLoading,
    title,
    author,
    summary,
    image,
    version,
    publishedOn,
    publicationType,
    currentSectionIndex,
    currentSectionLink,
    openSection,
    backToIndex,
    goToPreviousSection,
    goToNextSection,
  } = usePublicationIndex(event);

  if (currentSectionIndex >= 0 && currentSectionLink) {
    const currentSection = sections[currentSectionIndex];
    const sectionTitle =
      currentSection?.tags.find((tag) => tag[0] === 'title')?.[1] ||
      `Section ${currentSectionIndex + 1}`;

    return (
      <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
        <div className="flex flex-col w-full items-center justify-center gap-2 border-b pb-3">
          <Button size="sm" onClick={backToIndex}>
            <Book size={16} className="mr-2" />
            Back to Index
          </Button>
          <div className="flex w-full justify-between gap-1">
            <Button size="sm" onClick={goToPreviousSection} disabled={currentSectionIndex === 0}>
              <ChevronLeft size={16} />
            </Button>
            <Button
              size="sm"
              onClick={goToNextSection}
              disabled={currentSectionIndex === sections.length - 1}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
          <div className="text-center">
            <h5 className="font-medium text-sm">{sectionTitle}</h5>
            <span className="text-xs">
              {currentSectionIndex + 1} of {sections.length}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <SectionRenderer key={currentSectionLink} eventLink={currentSectionLink} />
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <Button onClick={goToPreviousSection} disabled={currentSectionIndex === 0}>
            <ChevronLeft size={16} className="mr-2" />
            Previous
          </Button>

          <span className="text-sm">
            {currentSectionIndex + 1} / {sections.length}
          </span>

          <Button onClick={goToNextSection} disabled={currentSectionIndex === sections.length - 1}>
            Next
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Book size={20} className="text-primary" />
          <h4 className="text-lg font-bold leading-tight">{title}</h4>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-primary/70">
          <span className="capitalize">{publicationType}</span>
          {author && <span>by {author}</span>}
          {version && <span>• v{version}</span>}
          {publishedOn && <span>• {new Date(publishedOn).getFullYear()}</span>}
        </div>
      </div>

      {image && <img src={image} alt={title} className="w-full max-h-48 object-cover rounded-lg" />}

      {summary && (
        <div className="[&_*]:text-sm border-l-2 border-primary/20 pl-3">
          <RichText content={summary} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText size={16} className="text-muted-foreground" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground bg-secondary/50 rounded-lg p-4">
          <Book size={24} className="mx-auto mb-2 opacity-50" />
          No sections in this publication yet
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText size={16} className="text-primary" />
            Table of Contents ({sections.length} sections)
          </div>
          <div className="space-y-1">
            {sections.map((section, index) => (
              <SectionPreview
                key={section.id}
                section={section}
                index={index + 1}
                onClick={() => openSection(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};