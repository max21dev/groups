import { CheckIcon, Copy } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { useCopyToClipboard } from '@/shared/hooks';

interface CustomCodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  children?: React.ReactNode;
}

export const Code: React.FC<CustomCodeProps> = ({ inline, children, className, ...props }) => {
  const { copyToClipboard, hasCopied } = useCopyToClipboard();

  let language = '';
  if (className) {
    const match = /language-(\w+)/.exec(className);
    if (match) {
      language = match[1];
    }
  }

  if (inline) {
    return (
      <code className="bg-primary/20 font-mono font-thin px-1 rounded-md" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="flex flex-col w-full bg-primary/20 rounded-lg">
      <div className="flex items-center">
        {language && (
          <div className="bg-primary/20 text-xs font-medium rounded-md px-2 py-0.5 m-1">
            {language.toUpperCase()}
          </div>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="m-1 ms-auto bg-unset hover:bg-primary/15 text-current hover:text-current h-6 p-1"
                onClick={() => copyToClipboard(children?.toString() || '')}
              >
                {hasCopied ? (
                  <CheckIcon size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{hasCopied ? 'Code Copied!' : 'Copy Code To Clipboard'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <pre className="max-w-[70vw] sm:max-w-[40vw] overflow-x-auto font-mono text-xs p-2">
        <code className="bg-transparent leading-relaxed font-thin" {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
};
