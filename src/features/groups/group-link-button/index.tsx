import { CheckIcon, Copy } from 'lucide-react';

import { useActiveGroup, useActiveRelay } from '@/shared/hooks';

import { Button } from '@/shared/components/ui/button';

import { useCopyToClipboard } from '@/shared/hooks';

export const GroupLinkButton = () => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();
  const { copyToClipboard, hasCopied } = useCopyToClipboard();
  return (
    <Button
      onClick={() =>
        copyToClipboard(
          `${window.location.origin}/relay/${activeRelay?.replace('wss://', '')}/group/${activeGroupId}`,
        )
      }
      variant="outline"
      className="flex gap-2"
    >
      {hasCopied ? (
        <>
          <CheckIcon className="text-green-600 h-4 w-4" /> Link Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" /> Copy Link
        </>
      )}
    </Button>
  );
};
