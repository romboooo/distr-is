import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useUserWithDetails } from '@/hooks/use-user-detail-hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LabelProfileForm } from '@/components/label/label-profile-form';

export const Route = createFileRoute('/_label/label/profile')({
  component: LabelProfilePage,
});

function LabelProfilePage() {
  const auth = useAuth();
  const userId = auth.data?.id;

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
        <Card>
          <CardHeader>
            <Skeleton className='mb-4 w-48 h-8' />
            <Skeleton className='w-96 h-4' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Skeleton className='w-24 h-4' />
                <Skeleton className='w-full h-10' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='w-24 h-4' />
                <Skeleton className='w-full h-10' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='w-24 h-4' />
                <Skeleton className='w-full h-10' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='w-24 h-4' />
                <Skeleton className='w-full h-10' />
              </div>
            </div>
            <Skeleton className='mt-4 w-32 h-12' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='mx-auto p-4 container'>
        <Alert variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to load profile information'}
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
            Could not load your profile. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const labelDetails = userData.type === 'LABEL' ? userData.labelDetails : null;

  return (
    <div className='space-y-6 mx-auto p-4 container'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-3xl'>Label Profile Settings</h1>
        <Button variant='outline' onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      {labelDetails ? (
        <LabelProfileForm
          user={userData}
          labelDetails={labelDetails}
          onProfileUpdated={refetch}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              You need to have label details to edit your profile. Please
              contact support to set up your label account.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
