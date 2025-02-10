import { useState } from 'react';
import ReactPlayer from 'react-player';

import { ChatEvent } from '@/features/chats';
import { UserMention } from '@/features/users/user-mention';

import { loader } from '@/shared/utils';

import { CategorizedChatContent } from '../../types';

export const ChatContent = ({
  categorizedChatContent,
  sameAsCurrentUser,
}: {
  categorizedChatContent: CategorizedChatContent[];
  sameAsCurrentUser?: boolean;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return categorizedChatContent.map((part, i) => {
    switch (part.category) {
      case 'text':
        return (
          <p key={i} className="text-sm">
            {part.content}
          </p>
        );
      case 'image':
        return (
          <div key={i}>
            <img
              src={loader(part.content, { w: 200 })}
              alt="chat"
              className="max-w-full mx-auto h-40 object-contain rounded-lg mt-2 cursor-pointer"
              onClick={() => setSelectedImage(part.content)}
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
          </div>
        );
      case 'video':
        return (
          <div key={i} className="max-w-full rounded-lg mt-2 react-player">
            <ReactPlayer width="100%" url={part.content} controls />
          </div>
        );
      case 'url':
        return (
          <a
            key={i}
            href={part.content}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-pink-400 underline"
          >
            {part.content}
          </a>
        );
      case 'mention':
        return (
          <UserMention key={i} npub={part.content} sameAsCurrentUser={sameAsCurrentUser ?? false} />
        );
      case 'event':
        return <ChatEvent key={i} event={part.content} sameAsCurrentUser={sameAsCurrentUser} />;
      default:
        return null;
    }
  });
};
