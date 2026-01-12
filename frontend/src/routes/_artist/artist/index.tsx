import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useUserWithDetails } from '@/hooks/use-user-detail-hooks';
import { ArtistDashboardHeader } from '@/components/artist/artist-dashboard-header';
import { ArtistProfileCard } from '@/components/artist/artist-profile-card';
import { LabelInfoCard } from '@/components/label/label-info-card';
import { QuickActionCard } from '@/components/artist/quick-action-card';

export const Route = createFileRoute('/_artist/artist/')({
  component: ArtistHome,
});

function ArtistHome() {
  const auth = useAuth();
  const userId = auth.data?.id;
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch
  } = useUserWithDetails(userId!);

  if (isLoading) {
    return (
      <div className="space-y-6 mx-auto p-4 container">
        <Skeleton className="w-64 h-12" />
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="mb-2 w-48 h-6" />
              <Skeleton className="w-32 h-4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-full h-4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="mb-2 w-48 h-6" />
              <Skeleton className="w-32 h-4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="w-full h-12" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto p-4 container">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to load artist information'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="mx-auto p-4 container">
        <Alert variant="destructive">
          <AlertTitle>No User Data</AlertTitle>
          <AlertDescription>
            Could not load your artist profile. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto p-4 container">
      <ArtistDashboardHeader userData={userData} />

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        <ArtistProfileCard userData={userData} />
        <LabelInfoCard userData={userData} onLabelCreated={refetch} />
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <QuickActionCard
          title="Create New Release"
          description="Upload your music and create a new release"
          onClick={() => navigate({ to: '/artist/releases/new' })}
        />
        <QuickActionCard
          title="Manage Releases"
          description="View and manage all your releases"
          onClick={() => navigate({ to: '/artist/releases' })}
        />
        <QuickActionCard
          title="View Royalties"
          description="Check your earnings and royalty reports"
          onClick={() => navigate({ to: '/artist/royalties' })}
        />
      </div>
    </div>
  );
}
