import { Badge } from '@/components/ui/badge';
import type { UserWithDetails } from '@/hooks/use-user-detail-hooks';

interface LabelDashboardHeaderProps {
  userData: UserWithDetails;
}

export function LabelDashboardHeader({
  userData,
}: LabelDashboardHeaderProps) {
  return (
    <div className='flex justify-between items-center'>
      <h1 className='font-bold text-3xl'>Label Dashboard</h1>
      <Badge variant='secondary' className='px-4 py-1 text-lg'>
        {userData.type === 'LABEL' ? 'Label' : 'Unknown Role'}
      </Badge>
    </div>
  );
}
