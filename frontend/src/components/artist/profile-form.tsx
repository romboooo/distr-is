import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUpdateUser } from '@/hooks/use-user-detail-hooks';
import { apiClient } from '@/services/api';
import type { Artist, User } from '@/types/api';
import { AxiosError } from 'axios';

interface ProfileFormProps {
  user: User;
  artistDetails: Artist | null;
  onProfileUpdated: () => void;
}

export function ProfileForm({
  user,
  artistDetails,
  onProfileUpdated,
}: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(artistDetails?.name || '');
  const [realName, setRealName] = useState(artistDetails?.realName || '');
  const [country, setCountry] = useState(artistDetails?.country || '');
  const [login, setLogin] = useState(user.login);

  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (artistDetails) {
      setName(artistDetails.name || '');
      setRealName(artistDetails.realName || '');
      setCountry(artistDetails.country || '');
    }
    setLogin(user.login);
  }, [user, artistDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update user login if changed
      if (login !== user.login) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          login,
        });
      }

      // Update artist details if changed and artist exists
      if (
        artistDetails &&
        (name !== artistDetails.name ||
          realName !== artistDetails.realName ||
          country !== artistDetails.country)
      ) {
        const artistUpdate = {
          id: artistDetails.id,
          name,
          realName,
          country,
          userId: user.id,
        };

        await apiClient.patch(`/artists/${artistDetails.id}`, artistUpdate);
      }

      toast.success('Profile updated successfully!');
      onProfileUpdated();
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || 'Failed to update profile',
        );
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your artist information and account details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='login'>Login</Label>
              <Input
                id='login'
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder='Your login'
                minLength={3}
                maxLength={50}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='name'>Artist Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your artist name'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='realName'>Real Name</Label>
              <Input
                id='realName'
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder='Your real name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='country'>Country</Label>
              <Input
                id='country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder='Your country'
              />
            </div>
          </div>

          <Button type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
