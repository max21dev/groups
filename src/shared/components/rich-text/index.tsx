import { useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

import { ChatEvent } from '@/features/chats';

import { Markdown } from '@/shared/components/markdown';
import { loader } from '@/shared/utils';

import { categorizeContent } from './utils';

export const RichText = ({
  content,
  eventPreview = false,
}: {
  content: string | null | undefined;
  eventPreview?: boolean;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categorizedContent = useMemo(() => {
    if (!content?.trim()) return [];
    return categorizeContent(content);
  }, [content]);

  if (!content?.trim()) {
    return null;
  }

  const elements: React.ReactNode[] = [];
  let textBuffer = '';

  const flushText = (key: number) => {
    if (textBuffer) {
      elements.push(<Markdown key={`md-${key}`} content={textBuffer} className="text-sm" />);
      textBuffer = '';
    }
  };

  categorizedContent.forEach((part, i) => {
    if (part.category === 'text') {
      textBuffer += part.content;
    } else {
      flushText(i);

      switch (part.category) {
        case 'image':
          elements.push(
            <div key={i}>
              <img
                src={loader(part.content, { w: 200 })}
                alt="chat"
                className="max-w-full mx-auto h-40 object-contain rounded-lg mt-2 cursor-pointer"
                onClick={() => setSelectedImage(part.content)}
                loading="lazy"
              />
              {selectedImage && (
                <div
                  className="fixed max-w-full p-20 inset-0 z-50 flex items-center justify-center bg-black/80"
                  onClick={() => setSelectedImage(null)}
                >
                  <img
                    src={selectedImage}
                    alt="Enlarged chat"
                    className="h-auto max-h-svh rounded-lg"
                  />
                </div>
              )}
            </div>,
          );
          break;
        case 'video':
          elements.push(
            <div key={i} className="react-player">
              <ReactPlayer url={part.content} controls width="100%" />
            </div>,
          );
          break;
        case 'event':
          elements.push(<ChatEvent key={i} event={part.content} eventPreview={eventPreview} />);
          break;
      }
    }
  });

  flushText(categorizedContent.length);

  return <>{elements}</>;
};
