import { NDKTag } from '@nostr-dev-kit/ndk';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { UserMention } from '@/features/users/user-mention';

import { EmojiRenderer } from '@/shared/components/emoji-renderer';
import { cn } from '@/shared/utils';

import { Code } from './components/code';
import { rehypeInlineCodeProperty } from './utils';

export const Markdown = ({
  content,
  className,
  emojiTags,
}: {
  content: string;
  className?: string;
  emojiTags?: NDKTag[];
}) => {
  return (
    <div className={cn('prose prose-invert max-w-full relative z-0', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeInlineCodeProperty]}
        components={{
          a: ({ href, children, ...props }) => {
            if (href?.startsWith('/user/')) {
              const id = href.replace('/user/', '');
              return <UserMention userIdentifier={id} />;
            }
            return (
              <a
                {...props}
                href={href}
                className="text-pink-400 break-all underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic opacity-80">
              {children}
            </blockquote>
          ),
          code: Code,
          img: ({ node, ...props }) => {
            if (props.src?.startsWith('/emoji/')) {
              const code = decodeURIComponent(props.src.replace('/emoji/', ''));
              const isBig = (props.title || '').toLowerCase() === 'big';
              return (
                <EmojiRenderer
                  shortcode={code}
                  tags={emojiTags}
                  className={isBig ? 'size-12 sm:size-28' : ''}
                />
              );
            }
            return <img {...props} className="rounded-md max-w-full" />;
          },
          hr: () => <hr className="border-t border-primary/50 my-6" />,
        }}
      >
        {content?.replace(/\*([^\*]+)\*/g, '**$1**')}
      </ReactMarkdown>
    </div>
  );
};
