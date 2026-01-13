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

interface LabelProfileCardProps {
  userData: UserWithDetails;
}

export function LabelProfileCard({ userData }: LabelProfileCardProps) {
  const navigate = useNavigate();
  const labelDetails = userData.type === 'LABEL' ? userData.labelDetails : null;

  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle>Label Profile</CardTitle>
        <CardDescription>
          Manage your label information and artists
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
          <div>
            <Label className='text-muted-foreground'>Contact Person</Label>
            <p className='mt-1 font-medium'>
              {labelDetails?.contactName || 'N/A'}
            </p>
          </div>
          <div>
            <Label className='text-muted-foreground'>Email</Label>
            <p className='mt-1 font-medium'>{labelDetails?.email || 'N/A'}</p>
          </div>
          <div>
            <Label className='text-muted-foreground'>Phone</Label>
            <p className='mt-1 font-medium'>{labelDetails?.phone || 'N/A'}</p>
          </div>
          <div>
            <Label className='text-muted-foreground'>Country</Label>
            <p className='mt-1 font-medium'>
              {labelDetails?.country || 'N/A'}
            </p>
          </div>
          <div>
            <Label className='text-muted-foreground'>Account Type</Label>
            <p className='mt-1 font-medium'>{userData.type}</p>
          </div>
          <div>
            <Label className='text-muted-foreground'>Associated User</Label>
            <p className='mt-1 font-medium'>{userData.login}</p>
          </div>
        </div>

        <div className='pt-4 border-t'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => navigate({ to: '/label/profile' })}
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
