import { PaperclipIcon } from 'lucide-react';

import { Spinner } from '@/shared/components/spinner';
import { Button } from '@/shared/components/ui/button';

export type UploadImageButtonProps = {
  openUploadImageDialog: () => void;
  isUploadingImage: boolean;
};

export const UploadImageButton = ({
  openUploadImageDialog,
  isUploadingImage,
}: UploadImageButtonProps) => {
  return (
    <Button
      size="icon"
      variant="link"
      className="group"
      onClick={openUploadImageDialog}
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
