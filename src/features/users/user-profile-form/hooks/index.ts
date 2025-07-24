import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useProfile } from 'nostr-hooks';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';
import { useUploadMedia } from '@/shared/hooks';

export const useUserProfileForm = () => {
  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();
  const { profile } = useProfile({ pubkey: activeUser?.pubkey });
  const { toast } = useToast();

  const imageUrlInputRef = useRef<HTMLInputElement>(null);
  const bannerUrlInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [image, setImage] = useState('');
  const [banner, setBanner] = useState('');
  const [about, setAbout] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isUploadingMedia: isUploadingImage, openUploadMediaDialog: openImageUploadDialog } =
    useUploadMedia(setImage, ['image/jpeg', 'image/png', 'image/gif'], imageUrlInputRef);

  const { isUploadingMedia: isUploadingBanner, openUploadMediaDialog: openBannerUploadDialog } =
    useUploadMedia(setBanner, ['image/jpeg', 'image/png', 'image/gif'], bannerUrlInputRef);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setDisplayName(profile.displayName ?? '');
      setImage(profile.image ?? '');
      setBanner(profile.banner ?? '');
      setAbout(profile.about ?? profile.bio ?? '');
      setWebsite(profile.website ?? '');
    }
  }, [profile]);

  const publishProfileEvent = async (profileData: Record<string, string>) => {
    try {
      if (!ndk || !activeUser) {
        toast({
          title: 'Error',
          description: 'Please make sure you are logged in',
          variant: 'destructive',
        });
        throw new Error('NDK or active user not available');
      }

      if (!activeUser.ndk?.signer) {
        toast({
          title: 'Error',
          description: 'No signer available. Please check your login',
          variant: 'destructive',
        });
        throw new Error('No signer available');
      }

      const event = new NDKEvent(ndk, {
        kind: 0,
        content: JSON.stringify(profileData),
        created_at: Math.floor(Date.now() / 1000),
        pubkey: activeUser.pubkey,
        tags: [],
      });

      try {
        await event.sign(activeUser.ndk.signer);
      } catch (error) {
        console.error('Error signing event:', error);
        toast({
          title: 'Error',
          description: 'Failed to sign the profile update',
          variant: 'destructive',
        });
        throw error;
      }

      try {
        await event.publish();
      } catch (error) {
        console.error('Error publishing event:', error);
        toast({
          title: 'Error',
          description: 'Failed to publish profile update. Please try again',
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });

      return event;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('NDK or active user')) {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred while updating your profile',
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const profileData = {
        name: name.trim(),
        display_name: displayName.trim(),
        picture: image.trim(),
        banner: banner.trim(),
        about: about.trim(),
        website: website.trim(),
      };

      // Remove empty fields
      Object.keys(profileData).forEach((key) => {
        if (!profileData[key as keyof typeof profileData]) {
          delete profileData[key as keyof typeof profileData];
        }
      });

      await publishProfileEvent(profileData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, displayName, image, banner, about, website]);

  return {
    activeUser,
    formData: {
      name,
      displayName,
      image,
      banner,
      about,
      website,
    },
    setters: {
      setName,
      setDisplayName,
      setImage,
      setBanner,
      setAbout,
      setWebsite,
    },
    imageUpload: {
      imageUrlInputRef,
      isUploadingImage,
      openImageUploadDialog,
    },
    bannerUpload: {
      bannerUrlInputRef,
      isUploadingBanner,
      openBannerUploadDialog,
    },
    isSubmitting,
    handleSubmit,
  };
};
