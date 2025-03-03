import { CloudUploadIcon, PaperclipIcon } from 'lucide-react';

import { Spinner } from '@/shared/components/spinner';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export type UploadMediaMenuProps = {
  openUploadMediaDialog: () => void;
  isUploadingMedia: boolean;
  openUploadToBlossomDialog: () => void;
  isUploadingToBlossom: boolean;
};

export const UploadMediaMenu = ({
  openUploadMediaDialog,
  isUploadingMedia,
  openUploadToBlossomDialog,
  isUploadingToBlossom,
}: UploadMediaMenuProps) => {
  const isUploading = isUploadingMedia || isUploadingToBlossom;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="link" className="group" disabled={isUploading}>
          {isUploading ? (
            <Spinner />
          ) : (
            <PaperclipIcon
              size={20}
              className="text-muted-foreground group-hover:text-accent-foreground"
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center gap-2"
            onClick={openUploadMediaDialog}
            disabled={isUploadingMedia}
          >
            <PaperclipIcon size={18} /> Upload Media
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center gap-2"
            onClick={openUploadToBlossomDialog}
            disabled={isUploadingToBlossom}
          >
            <CloudUploadIcon size={18} /> Upload to Blossom
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
