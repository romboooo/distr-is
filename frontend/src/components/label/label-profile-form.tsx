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
import { toast } from 'sonner';
import { useUpdateUser } from '@/hooks/use-user-detail-hooks';
import { apiClient } from '@/services/api';
import type { LabelData, User } from '@/types/api';
import { AxiosError } from 'axios';
import { Label } from '@/components/ui/label';

interface LabelProfileFormProps {
  user: User;
  labelDetails: LabelData | null;
  onProfileUpdated: () => void;
}

export function LabelProfileForm({
  user,
  labelDetails,
  onProfileUpdated,
}: LabelProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactName, setContactName] = useState(labelDetails?.contactName || '');
  const [phone, setPhone] = useState(labelDetails?.phone || '');
  const [email, setEmail] = useState(labelDetails?.email || '');
  const [country, setCountry] = useState(labelDetails?.country || '');
  const [login, setLogin] = useState(user.login);

  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (labelDetails) {
      setContactName(labelDetails.contactName || '');
      setPhone(labelDetails.phone || '');
      setEmail(labelDetails.email || '');
      setCountry(labelDetails.country || '');
    }
    setLogin(user.login);
  }, [user, labelDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (login !== user.login) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          login,
        });
      }

      if (
        labelDetails &&
        (contactName !== labelDetails.contactName ||
          phone !== labelDetails.phone ||
          email !== labelDetails.email ||
          country !== labelDetails.country)
      ) {
        const labelUpdate = {
          id: labelDetails.id,
          contactName,
          phone,
          email,
          country,
          userId: user.id,
        };

        await apiClient.patch(`/labels/${labelDetails.id}`, labelUpdate);
      }

      toast.success('Label profile updated successfully!');
      onProfileUpdated();
    } catch (error) {
      console.error('Error updating label profile:', error);
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || 'Failed to update label profile',
        );
      } else {
        toast.error('Failed to update label profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Label Profile</CardTitle>
        <CardDescription>
          Update your label information and account details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='login'>Account Login</Label>
              <Input
                id='login'
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder='Your account login'
                minLength={3}
                maxLength={50}
                required
              />
              <p className='text-muted-foreground text-xs'>
                This is your account login used for authentication
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='contactName'>Contact Person</Label>
              <Input
                id='contactName'
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder='Primary contact name'
                required
              />
            </div>

            <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='contact@label.com'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input
                  id='phone'
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='+1 (555) 123-4567'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='country'>Country</Label>
              <Input
                id='country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder='Label country/region'
                required
              />
            </div>
          </div>

          <Button type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? 'Updating...' : 'Update Label Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
