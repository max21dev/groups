import { ChatContent } from '@/features/chats/chat-list/components/chat-list-item/components';

import { useNote } from './hooks';

export const Note = ({
  content,
  sameAsCurrentUser,
}: {
  content: string;
  sameAsCurrentUser?: boolean;
}) => {
  const { categorizedChatContent, selectedImage, setSelectedImage } = useNote(content);

  return (
    <div className="set-max-h flex flex-col gap-1 p-2 rounded-md overflow-y-auto [overflow-wrap:anywhere]">
      <ChatContent
        setSelectedImage={setSelectedImage}
        categorizedChatContent={categorizedChatContent}
        sameAsCurrentUser={sameAsCurrentUser}
      />

      {/* Image Overlay */}
      {selectedImage && (
        <div
          className="fixed max-w-full p-20 inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Enlarged chat" className="h-auto max-h-svh rounded-lg" />
        </div>
      )}
    </div>
  );
};
