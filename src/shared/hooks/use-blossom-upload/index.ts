import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { RefObject, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

const DEFAULT_SERVER = 'https://blossom.primal.net/';

export const useBlossomUpload = <T extends HTMLTextAreaElement | HTMLInputElement>(
  setMediaUrl: (url: string | ((prev: string) => string)) => void,
  allowedFormats: string[],
  inputRef?: RefObject<T>,
  append?: boolean,
  getUserServers?: () => Promise<string[]>,
) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();

  const handleUploadError = (error: unknown) => {
    console.error(error);
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

  const generateBlossomAuthEvent = async (fileHash: string) => {
    if (!ndk || !activeUser) {
      throw new Error('NDK or active user is not available.');
    }

    const event = new NDKEvent(ndk, {
      kind: 24242,
      created_at: Math.floor(Date.now() / 1000),
      content: 'Upload file',
      tags: [
        ['t', 'upload'],
        ['x', fileHash],
        ['expiration', (Math.floor(Date.now() / 1000) + 3600).toString()],
      ],
      pubkey: activeUser.pubkey,
    });

    await event.sign();
    return btoa(JSON.stringify(event.rawEvent()));
  };

  const openUploadDialog = () => {
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

      setIsUploading(true);

      try {
        const fileBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
        const fileHash = Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        let servers = getUserServers ? await getUserServers() : [];
        if (servers.length === 0) {
          servers = [DEFAULT_SERVER];
        }

        const server = servers[0];
        const authEvent = await generateBlossomAuthEvent(fileHash);

        const response = await fetch(`${server}/upload`, {
          method: 'PUT',
          headers: { Authorization: `Nostr ${authEvent}` },
          body: file,
        });

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.url) {
            updateMediaUrl(responseData.url);
            toast({ title: 'Success', description: 'Media uploaded successfully.' });
          } else {
            handleUploadError('Invalid server response.');
          }
        } else {
          const errorText = await response.text();
          handleUploadError(`Error: ${errorText}`);
        }
      } catch (error) {
        handleUploadError(error);
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  return {
    openUploadDialog,
    isUploading,
  };
};
