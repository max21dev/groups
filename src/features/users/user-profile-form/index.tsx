import { UploadImageButton } from '@/features/chats/chat-bottom-bar/components';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

import { useUserProfileForm } from './hooks';

export const UserProfileForm = () => {
  const { activeUser, formData, setters, imageUpload, bannerUpload, isSubmitting, handleSubmit } =
    useUserProfileForm();

  if (!activeUser) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Please log in to edit your profile
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="user-name">Username:</Label>
          <Input
            id="user-name"
            type="text"
            placeholder="johndoe"
            value={formData.name}
            onChange={(e) => setters.setName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="user-display-name">Display Name:</Label>
          <Input
            id="user-display-name"
            type="text"
            placeholder="John Doe"
            value={formData.displayName}
            onChange={(e) => setters.setDisplayName(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="user-image">Profile Picture (URL):</Label>
          <div className="relative">
            <Input
              ref={imageUpload.imageUrlInputRef}
              id="user-image"
              className="pr-10"
              type="text"
              placeholder="https://example.com/picture.jpg"
              value={formData.image}
              onChange={(e) => setters.setImage(e.target.value)}
            />
            <span className="[&_.animate-spin]:h-6 [&_.animate-spin]:w-6 bg-gray-200 dark:bg-gray-900 rounded-md rounded-s-none absolute top-0 end-0">
              <UploadImageButton
                isUploadingMedia={imageUpload.isUploadingImage}
                openUploadMediaDialog={imageUpload.openImageUploadDialog}
              />
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="user-banner">Banner Image (URL):</Label>
          <div className="relative">
            <Input
              ref={bannerUpload.bannerUrlInputRef}
              id="user-banner"
              className="pr-10"
              type="text"
              placeholder="https://example.com/banner.jpg"
              value={formData.banner}
              onChange={(e) => setters.setBanner(e.target.value)}
            />
            <span className="[&_.animate-spin]:h-6 [&_.animate-spin]:w-6 bg-gray-200 dark:bg-gray-900 rounded-md rounded-s-none absolute top-0 end-0">
              <UploadImageButton
                isUploadingMedia={bannerUpload.isUploadingBanner}
                openUploadMediaDialog={bannerUpload.openBannerUploadDialog}
              />
            </span>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="user-website">Website:</Label>
        <Input
          id="user-website"
          type="url"
          placeholder="https://example.com"
          value={formData.website}
          onChange={(e) => setters.setWebsite(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="user-about">About / Bio:</Label>
        <Textarea
          id="user-about"
          placeholder="Tell us about yourself..."
          value={formData.about}
          onChange={(e) => setters.setAbout(e.target.value)}
          rows={4}
        />
      </div>

      <div>
        <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </div>
  );
};
