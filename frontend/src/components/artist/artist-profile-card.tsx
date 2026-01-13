import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import type { UserWithDetails } from '@/hooks/use-user-detail-hooks';

interface ArtistProfileCardProps {
  userData: UserWithDetails;
}

export function ArtistProfileCard({ userData }: ArtistProfileCardProps) {
  const navigate = useNavigate();
  const artistDetails =
    userData.type === 'ARTIST' ? userData.artistDetails : null;

  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle>Artist Profile</CardTitle>
        <CardDescription>
          Manage your artist information and releases
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
          <div>
            <Label className='text-muted-foreground'>Artist Name</Label>
            <p className='mt-1 font-medium'>{artistDetails?.name || 'N/A'}</p>
          </div>
          <div>
            <Label className='text-muted-foreground'>Real Name</Label>
            <p className='mt-1 font-medium'>
              {artistDetails?.realName || 'N/A'}
            </p>
          </div>
          <div>
            <Label className='text-muted-foreground'>Country</Label>
            <p className='mt-1 font-medium'>
              {artistDetails?.country || 'N/A'}
            </p>
          </div>
          <div>
            <Label className='text-muted-foreground'>Account Type</Label>
            <p className='mt-1 font-medium'>{userData.type}</p>
          </div>
        </div>

        <div className='pt-4 border-t'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => navigate({ to: '/artist/profile' })}
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
