import asciidoctor from '@asciidoctor/core';
import { Asciidoc as BaseAsciidoc, prepareDocument } from '@oxide/react-asciidoc';
import { useMemo } from 'react';

import { cn } from '@/shared/utils';

const processingOptions = {
  sectlinks: 'true',
  icons: 'font',
  stem: 'latexmath',
  stylesheet: false,
};

const asciidocProcessor = asciidoctor();

export const AsciidocRenderer = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  const processedDocument = useMemo(() => {
    if (!content.trim()) return null;

    try {
      return asciidocProcessor.load(content, {
        standalone: true,
        attributes: processingOptions,
      });
    } catch (error) {
      console.error('Error processing Asciidoc content:', error);
      return null;
    }
  }, [content]);

  if (!processedDocument) {
    return <div className="text-muted-foreground italic text-sm">No content available</div>;
  }

  return (
    <div
      className={cn(
        // Base
        'max-w-full relative z-0',
        // Typography
        '[&_p]:break-words [&_p]:my-3 [&_p]:leading-tight',
        '[&_pre]:text-xs [&_pre]:font-mono [&_pre]:overflow-y-auto',
        '[&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul>li]:mt-2',
        '[&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol>li]:mt-2',
        // Links
        '[&_a]:text-pink-400 [&_a]:break-all [&_a]:underline',
        // Headings
        '[&_h1]:scroll-m-20 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:lg:text-4xl',
        '[&_h2]:scroll-m-20 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight',
        '[&_h3]:scroll-m-20 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight',
        '[&_h4]:scroll-m-20 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:tracking-tight',
        // Blockquotes
        '[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:opacity-80',
        // Code
        '[&_code]:relative [&_code]:rounded [&_code]:bg-primary/20 [&_code]:px-[0.3rem] [&_code]:py-[0.2rem] [&_code]:font-mono [&_code]:text-sm [&_code]:font-semibold',
        // Images
        '[&_.imageblock_.content]:my-3 [&_.imageblock_.content]:flex [&_.imageblock_.content]:justify-center [&_.imageblock_.content]:items-center',
        '[&_.imageblock_img]:object-cover [&_.imageblock_img]:w-full [&_.imageblock_img]:aspect-auto [&_.imageblock_img]:rounded-md [&_.imageblock_img]:max-w-full',
        // HR
        '[&_hr]:border-t [&_hr]:border-primary/50 [&_hr]:my-6',
        // Tables
        '[&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-border',
        '[&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-2 [&_th]:bg-muted [&_th]:font-semibold',
        '[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2',
        // Footnotes
        '[&_#footnotes]:text-sm',
        '[&_.footnote]:first:mt-0 [&_.footnote]:my-1 [&_.footnote]:mx-2',
        // Strong and em
        '[&_strong]:font-bold',
        '[&_em]:italic',
        // Small text
        '[&_small]:text-sm [&_small]:font-medium [&_small]:leading-none',
        className,
      )}
    >
      <BaseAsciidoc document={prepareDocument(processedDocument)} />
    </div>
  );
};
