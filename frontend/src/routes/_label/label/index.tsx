import { QuickActionCard } from '@/components/layouts/quick-action-card';
import { LabelInfoCard } from '@/components/label/label-info-card';
import { LabelProfileCard } from '@/components/label/label-profile-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useUserWithDetails } from '@/hooks/use-user-detail-hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { LabelDashboardHeader } from '@/components/label/label-dashboard-header';

export const Route = createFileRoute('/_label/label/')({
  component: LabelHome,
});


function LabelHome() {
  const auth = useAuth();
  const userId = auth.data?.id;
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserWithDetails(userId!);

  if (isLoading) {
    return (
      <div className='space-y-6 mx-auto p-4 container'>
        <Skeleton className='w-64 h-12' />
        <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <Skeleton className='mb-2 w-48 h-6' />
              <Skeleton className='w-32 h-4' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Skeleton className='w-24 h-4' />
                <Skeleton className='w-full h-4' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='w-24 h-4' />
                <Skeleton className='w-full h-4' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className='mb-2 w-48 h-6' />
              <Skeleton className='w-32 h-4' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <Skeleton className='w-full h-12' />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='mx-auto p-4 container'>
        <Alert variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to load label information'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='mx-auto p-4 container'>
        <Alert variant='destructive'>
          <AlertTitle>No User Data</AlertTitle>
          <AlertDescription>
            Could not load your label profile. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='space-y-6 mx-auto p-4 container'>
      <LabelDashboardHeader userData={userData} />

      <div className='gap-6 grid grid-cols-1 lg:grid-cols-3'>
        <LabelProfileCard userData={userData} />
        <LabelInfoCard userData={userData} onLabelCreated={refetch} />
      </div>

      <div className='gap-4 grid grid-cols-1 md:grid-cols-3'>
        <QuickActionCard
          title='Create New Release'
          description='Upload your music and create a new release'
          onClick={() => navigate({ to: '/label/releases/new' })}
        />
        <QuickActionCard
          title='Manage Releases'
          description='View and manage all your releases'
          onClick={() => navigate({ to: '/label/releases' })}
        />
        <QuickActionCard
          title='View Royalties'
          description='Check your earnings and royalty reports'
          onClick={() => navigate({ to: '/label/royalties' })}
        />
      </div>
    </div>
  );
}
