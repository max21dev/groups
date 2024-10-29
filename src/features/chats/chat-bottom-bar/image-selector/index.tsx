import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { CogIcon, ImageIcon } from 'lucide-react';
import { loader } from '@/shared/utils';
import { Button } from '@/shared/components/ui/button';

interface Props {
  setImage: (image: string) => void;
}

export const ImageSelector = ({ setImage }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const handleImageChange = (url: string) => {
    setImage(url);
    setImageUrl(url);
  };

  const handleUploadError = () => {
    toast({
      title: 'Error',
      description: 'Failed to upload image',
      variant: 'destructive',
    });
    setIsUploading(false);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('fileToUpload', acceptedFiles[0]);

    try {
      const response = await fetch(import.meta.env.VITE_NOSTR_BUILD_UPLOAD_API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      const { status, data } = await response.json();
      if (status === 'success' && data?.[0]?.url) {
        handleImageChange(data[0].url);
      } else {
        handleUploadError();
      }
    } catch {
      handleUploadError();
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Tabs defaultValue="upload" className="w-full mt-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="stock">Stock Images</TabsTrigger>
        <TabsTrigger value="url">URL</TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <div className="mt-4">
          <h4 className="text-lg">Image / Upload</h4>
          <div className="mt-2 flex justify-center rounded-lg border border-gray-300 px-4 py-6 bg-gray-50">
            <div className="text-center" {...getRootProps()}>
              <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label className="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500">
                  {!isUploading && <span>Upload a file</span>}
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" {...getInputProps()} />
                </label>
                {!isUploading && <p className="pl-1">or drag and drop</p>}
              </div>
              {isUploading ? (
                <div className="w-full flex justify-center items-center">
                  <CogIcon className="h-6 w-6 text-gray-500 animate-spin" />
                  <span className="ml-1 text-xs text-gray-500">Uploading...</span>
                </div>
              ) : (
                <p className="text-xs leading-5 text-gray-600">
                  {isDragActive ? 'Drop here...' : 'PNG, JPG, GIF up to 10MB'}
                </p>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="stock">Coming soon!!</TabsContent>

      <TabsContent value="url">
        <div className="mt-4">
          <label htmlFor="cover-image-url" className="block text-sm font-medium leading-6 text-gray-900">
            Image / URL
          </label>
          <Input
            id="cover-image-url"
            name="cover-image-url"
            placeholder="https://"
            onChange={(e) => handleImageChange(e.target.value)}
          />
        </div>
      </TabsContent>

      {imageUrl && (
        <div className="mt-4">
          <h6 className="text-lg">Image / Selected Image</h6>
          <div className="mt-2 flex justify-center rounded-lg border border-gray-300 px-4 py-4">
            <div className="flex flex-col gap-2 items-center">
              <img
                src={loader(imageUrl, { w: 500, h: 400 })}
                alt="Selected"
                className="w-32 h-auto rounded-md bg-gray-100"
                loading="lazy"
              />
              <Button
                variant="outline"
                onClick={() => handleImageChange('')}
              >
                Change Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </Tabs>
  );
};