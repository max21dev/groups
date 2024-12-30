import { useNip98 } from 'nostr-hooks';
import { useRef, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useGroupMetadataForm = (setPicture: (url: string) => void) => {
  const groupImageUrlInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingGroupImage, setIsUploadingGroupImage] = useState(false);

  const { getToken } = useNip98();

  const { toast } = useToast();

  const updateGroupImageUrl = (url: string) => {
    setPicture(url);
    if (groupImageUrlInputRef.current) {
      groupImageUrlInputRef.current.focus();
    }
  };

  const handleUploadError = (e: unknown) => {
    console.error(e);
    toast({ title: 'Error', description: 'Failed to upload Group Image', variant: 'destructive' });
  };

  const openUploadImageDialog = () => {
    const input = document.createElement('input');
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    input.type = 'file';
    input.accept = allowedTypes.join(',');

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Invalid file type. Please upload an image.',
          variant: 'destructive',
        });
        return;
      }

      const formData = new FormData();
      formData.append('fileToUpload', file);

      setIsUploadingGroupImage(true);

      const token = await getToken({
        url: import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT,
        method: 'POST',
      });

      if (!token) {
        toast({
          title: 'Error',
          description: 'Failed to upload media',
          variant: 'destructive',
        });

        return;
      }

      fetch(import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then(({ status, data }) => {
          if (status === 'success' && data?.[0]?.url) {
            updateGroupImageUrl(data[0].url);
          } else {
            handleUploadError(status);
          }
        })
        .catch((e) => {
          handleUploadError(e);
        })
        .finally(() => {
          setIsUploadingGroupImage(false);
        });
    };

    input.click();
  };

  return {
    groupImageUrlInputRef,
    isUploadingGroupImage,
    openUploadImageDialog,
  };
};
