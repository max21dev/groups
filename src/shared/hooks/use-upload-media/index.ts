import { useNip98 } from 'nostr-hooks';
import { RefObject, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useUploadMedia = <T extends HTMLTextAreaElement | HTMLInputElement>(
  setMediaUrl: (url: string | ((prev: string) => string)) => void,
  allowedFormats: string[],
  inputRef?: RefObject<T>,
  append?: boolean,
) => {
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const { getToken } = useNip98();
  const { toast } = useToast();

  const handleUploadError = (e: unknown) => {
    console.error(e);
    toast({ title: 'Error', description: 'Failed to upload media', variant: 'destructive' });
  };

  const isFileTypeAllowed = (fileType: string) => {
    return allowedFormats.some((format) => {
      if (format.includes('/*')) {
        return fileType.startsWith(format.split('/')[0]);
      }
      return fileType === format;
    });
  };

  const updateMediaUrl = (url: string) => {
    setMediaUrl((prev) => (append && prev.trim() ? `${prev}\n${url}` : url));
    inputRef?.current?.focus();
  };

  const openUploadMediaDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = allowedFormats.join(',');

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!isFileTypeAllowed(file.type)) {
        toast({
          title: 'Error',
          description: `Invalid file type. Allowed formats: ${allowedFormats.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      const formData = new FormData();
      formData.append('fileToUpload', file);

      setIsUploadingMedia(true);

      const token = await getToken({
        url: import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT,
        method: 'POST',
      });

      if (!token) {
        toast({ title: 'Error', description: 'Failed to upload media', variant: 'destructive' });
        setIsUploadingMedia(false);
        return;
      }

      try {
        const response = await fetch(import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: { Authorization: token },
        }).then((res) => res.json());

        if (response.status === 'success' && response.data?.[0]?.url) {
          updateMediaUrl(response.data[0].url);
        } else {
          handleUploadError(response.status);
        }
      } catch (e) {
        handleUploadError(e);
      } finally {
        setIsUploadingMedia(false);
      }
    };

    input.click();
  };

  return {
    openUploadMediaDialog,
    isUploadingMedia,
  };
};
