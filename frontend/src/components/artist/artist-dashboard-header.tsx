import { Badge } from '@/components/ui/badge';
import type { UserWithDetails } from '@/hooks/use-user-detail-hooks';

interface ArtistDashboardHeaderProps {
  userData: UserWithDetails;
}

export function ArtistDashboardHeader({
  userData,
}: ArtistDashboardHeaderProps) {
  return (
    <div className='flex justify-between items-center'>
      <h1 className='font-bold text-3xl'>Artist Dashboard</h1>
      <Badge variant='secondary' className='px-4 py-1 text-lg'>
        {userData.type === 'ARTIST' ? 'Artist' : 'Label Owner'}
      </Badge>
    </div>
  );
}
