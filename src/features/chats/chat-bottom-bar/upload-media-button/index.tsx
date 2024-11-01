import { PaperclipIcon } from 'lucide-react';

import { Spinner } from '@/shared/components/spinner';
import { Button } from '@/shared/components/ui/button';

export type UploadImageButtonProps = {
  openUploadMediaDialog: () => void;
  isUploadingImage: boolean;
};

export const UploadImageButton = ({
  openUploadMediaDialog,
  isUploadingImage,
}: UploadImageButtonProps) => {
  return (
    <Button
      size="icon"
      variant="link"
      className="group"
      onClick={openUploadMediaDialog}
      disabled={isUploadingImage}
    >
      {!isUploadingImage ? (
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
