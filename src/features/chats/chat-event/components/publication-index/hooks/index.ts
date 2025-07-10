import { NDKEvent, NDKKind, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { getNostrLink } from '@/shared/utils';

export const usePublicationIndex = (event: NostrEvent) => {
  const [sections, setSections] = useState<NDKEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(-1); // -1 means showing index
  const [currentSectionLink, setCurrentSectionLink] = useState<string | null>(null);
  const { ndk } = useNdk();

  const title = event.tags.find((tag) => tag[0] === 'title')?.[1] || 'Untitled Publication';
  const author = event.tags.find((tag) => tag[0] === 'author')?.[1];
  const summary = event.tags.find((tag) => tag[0] === 'summary')?.[1] || event.content;
  const image = event.tags.find((tag) => tag[0] === 'image')?.[1];
  const version = event.tags.find((tag) => tag[0] === 'version')?.[1];
  const publishedOn = event.tags.find((tag) => tag[0] === 'published_on')?.[1];
  const publicationType = event.tags.find((tag) => tag[0] === 'type')?.[1] || 'book';

  useEffect(() => {
    if (!ndk || !event.tags) return;

    const loadSections = async () => {
      try {
        setIsLoading(true);

        const aTags = event.tags.filter((tag) => tag[0] === 'a');

        if (aTags.length === 0) {
          setSections([]);
          return;
        }

        const sectionsPromises = aTags.map(async (tag) => {
          const [kind, pubkey, identifier] = tag[1].split(':');
          const eventKind = parseInt(kind) as NDKKind;

          if (![30040, 30041].includes(eventKind)) return null;

          try {
            const events = await ndk.fetchEvents({
              kinds: [eventKind],
              authors: [pubkey],
              '#d': [identifier],
            });

            const eventArray = Array.from(events);
            if (eventArray.length === 0) return null;

            return eventArray.sort((a, b) => b.created_at! - a.created_at!)[0];
          } catch (error) {
            console.error(`Error fetching section ${tag[1]}:`, error);
            return null;
          }
        });

        const resolvedSections = await Promise.all(sectionsPromises);
        const validSections = resolvedSections.filter(
          (section): section is NDKEvent => section !== null,
        );

        setSections(validSections);
      } catch (error) {
        console.error('Error loading publication sections:', error);
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSections();
  }, [ndk, event.tags]);

  const openSection = (index: number) => {
    const section = sections[index];
    if (section) {
      const sectionLink = getNostrLink(section.id, section.pubkey, section.kind!);
      setCurrentSectionLink(sectionLink);
      setCurrentSectionIndex(index);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      openSection(currentSectionIndex + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      openSection(currentSectionIndex - 1);
    }
  };

  const backToIndex = () => {
    setCurrentSectionIndex(-1);
    setCurrentSectionLink(null);
  };

  return {
    sections,
    isLoading,
    currentSectionIndex,
    currentSectionLink,
    title,
    author,
    summary,
    image,
    version,
    publishedOn,
    publicationType,
    openSection,
    goToNextSection,
    goToPreviousSection,
    backToIndex,
  };
};
