import { PaperclipIcon } from 'lucide-react';

import { Spinner } from '@/shared/components/spinner';
import { Button } from '@/shared/components/ui/button';

export type UploadImageButtonProps = {
  openUploadMediaDialog: () => void;
  isUploadingMedia: boolean;
};

export const UploadImageButton = ({
  openUploadMediaDialog,
  isUploadingMedia,
}: UploadImageButtonProps) => {
  return (
    <Button
      size="icon"
      variant="link"
      className="group"
      onClick={openUploadMediaDialog}
      disabled={isUploadingMedia}
    >
      {!isUploadingMedia ? (
        <PaperclipIcon
          size={20}
          className="text-muted-foreground group-hover:text-accent-foreground"
        />
      ) : (
        <Spinner />
      )}
    </Button>
  );
};
