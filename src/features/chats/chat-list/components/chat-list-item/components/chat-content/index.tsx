import ReactPlayer from 'react-player';

import { loader } from '@/shared/utils';

import { ChatEvent } from '@/features/chats';
import { UserMention } from '@/features/users/user-mention';

import { CategorizedChatContent } from '../../types';

export const ChatContent = ({
                              categorizedChatContent,
                              sameAsCurrentUser,
                              setSelectedImage,
                            }: {
  categorizedChatContent: CategorizedChatContent[];
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  sameAsCurrentUser?: boolean;
}) => {
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
          <img
            key={i}
            src={loader(part.content, { w: 200 })}
            alt="chat"
            className="max-w-full h-40 object-contain rounded-lg mt-2 cursor-pointer"
            onClick={() => setSelectedImage(part.content)}
          />
        );
      case 'video':
        return (
          <div className="max-w-full rounded-lg mt-2 react-player">
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