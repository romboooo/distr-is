// src/routes/_artist/artist/royalties/$releaseId.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { useGetReleaseById } from '@/hooks/use-release-hooks';
import { ReleaseCoverImage } from '@/components/releases/release-cover-image';
import { useAuth } from '@/hooks/use-auth';
import { useGetArtistByUserId } from '@/hooks/use-artists';
import { RoyaltiesTable } from '@/components/royalties/royalties-table';
import { useGetLabelById } from '@/hooks/use-label-hooks';

export const Route = createFileRoute('/_artist/artist/royalties/$releaseId')({
  component: ReleaseRoyaltiesDetailPage,
});

function ReleaseRoyaltiesDetailPage() {
  const { releaseId } = Route.useParams();
  const navigate = useNavigate();
  const parsedReleaseId = parseInt(releaseId);
  const { data: user } = useAuth();
  const { data: artist } = useGetArtistByUserId(user?.id);

  const { data: release, isLoading, error } = useGetReleaseById(parsedReleaseId);
  const { data: label } = useGetLabelById(release?.labelId);
  useEffect(() => {
    if (isNaN(parsedReleaseId)) {
      navigate({ to: '/artist/royalties' });
    }
  }, [parsedReleaseId, navigate]);

  if (isLoading) {
    return (
      <div className='mx-auto py-8 max-w-5xl container'>
        {/* Header skeleton */}
        <div className='flex items-center gap-4 mb-8'>
          <Skeleton className='rounded w-10 h-10' />
          <div>
            <Skeleton className='mb-2 w-48 h-8' />
            <Skeleton className='w-32 h-4' />
          </div>
        </div>

        {/* Release details skeleton */}
        <Card className='mb-8'>
          <CardHeader className='flex flex-row justify-between items-start pb-4'>
            <div>
              <Skeleton className='mb-2 w-64 h-7' />
              <div className='flex gap-2 mt-2'>
                <Skeleton className='w-20 h-6' />
                <Skeleton className='w-24 h-6' />
              </div>
            </div>
            <Skeleton className='rounded-md w-24 h-24' />
          </CardHeader>
          <CardContent>
            <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
              <div>
                <Skeleton className='mb-1 w-32 h-4' />
                <Skeleton className='w-48 h-5' />
              </div>
              <div>
                <Skeleton className='mb-1 w-32 h-4' />
                <Skeleton className='w-48 h-5' />
              </div>
              <div>
                <Skeleton className='mb-1 w-32 h-4' />
                <Skeleton className='w-48 h-5' />
              </div>
              <div>
                <Skeleton className='mb-1 w-32 h-4' />
                <Skeleton className='w-48 h-5' />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Royalties table skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='w-48 h-7' />
          </CardHeader>
          <CardContent>
            <div className='border rounded-lg overflow-hidden'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-muted'>
                    {[...Array(4)].map((_, i) => (
                      <th key={i} className='p-4 text-left'>
                        <Skeleton className='w-24 h-5' />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className='border-b'>
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className='p-4'>
                          <Skeleton className='w-full h-6' />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='flex justify-between items-center p-4 border-t'>
                <Skeleton className='w-40 h-8' />
                <Skeleton className='w-64 h-8' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !release) {
    return (
      <div className='mx-auto py-12 max-w-2xl text-center container'>
        <div className='flex justify-center mb-6'>
          <div className='bg-destructive/10 p-4 rounded-full'>
            <DollarSign className='w-12 h-12 text-destructive' />
          </div>
        </div>
        <h1 className='mb-4 font-bold text-2xl'>Release Not Found</h1>
        <p className='mb-6 text-muted-foreground'>
          {error ?
            error instanceof Error ? error.message : 'Failed to load release details' :
            'The requested release could not be found.'}
        </p>
        <Button onClick={() => navigate({ to: '/artist/royalties' })} variant='outline'>
          <ArrowLeft className='mr-2 w-4 h-4' />
          Back to Royalties
        </Button>
      </div>
    );
  }

  // Check if this release belongs to the current artist
  if (artist && release.artistId !== artist.id) {
    return (
      <div className='mx-auto py-12 max-w-2xl text-center container'>
        <div className='flex justify-center mb-6'>
          <div className='bg-destructive/10 p-4 rounded-full'>
            <DollarSign className='w-12 h-12 text-destructive' />
          </div>
        </div>
        <h1 className='mb-4 font-bold text-2xl'>Access Denied</h1>
        <p className='mb-6 text-muted-foreground'>
          You don't have permission to view royalties for this release.
        </p>
        <Button onClick={() => navigate({ to: '/artist/royalties' })} variant='outline'>
          <ArrowLeft className='mr-2 w-4 h-4' />
          Back to Royalties
        </Button>
      </div>
    );
  }

  return (
    <div className='mx-auto py-8 max-w-5xl container'>
      {/* Header with back button */}
      <div className='mb-8'>
        <Button
          variant='ghost'
          onClick={() => navigate({ to: '/artist/royalties' })}
          className='mb-4'
        >
          <ArrowLeft className='mr-2 w-4 h-4' />
          Back to All Royalties
        </Button>
        <div className='flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4'>
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>Royalty Report</h1>
            <p className='text-muted-foreground'>
              Detailed royalty breakdown for "{release.name}"
            </p>
          </div>
          <Badge variant={
            release.moderationState === 'APPROVED'
              ? 'default'
              : release.moderationState === 'DRAFT'
                ? 'secondary'
                : 'destructive'
          } className='px-4 py-1 text-base'>
            {release.moderationState.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Release details card */}
      <Card className='mb-8'>
        <CardHeader className='flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4 pb-4'>
          <div className='space-y-2'>
            <CardTitle className='text-2xl'>{release.name}</CardTitle>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='secondary' className='px-3 py-1 text-base'>
                {artist?.name}
              </Badge>
              <Badge className='px-3 py-1 text-base'>
                {release.releaseType.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <div className='relative w-32 h-32 shrink-0'>
            <ReleaseCoverImage
              releaseId={release.id}
              releaseName={release.name}
              className='rounded-lg w-full h-full object-cover'
              fallback={
                <div className='flex justify-center items-center bg-muted rounded-lg w-full h-full font-medium text-sm'>
                  No cover
                </div>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
            <div>
              <h3 className='mb-1 font-medium text-muted-foreground'>Release Date</h3>
              <p className='font-semibold text-lg'>
                {new Date(release.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <h3 className='mb-1 font-medium text-muted-foreground'>UPC</h3>
              <p className='font-mono text-lg'>{release.releaseUpc}</p>
            </div>
            <div>
              <h3 className='mb-1 font-medium text-muted-foreground'>Genre</h3>
              <p className='text-lg'>{release.genre || 'Not specified'}</p>
            </div>
            <div>
              <h3 className='mb-1 font-medium text-muted-foreground'>Label</h3>
              <p className='text-lg'>{label?.contactName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Royalties table */}
      <Card>
        <CardHeader>
          <div className='flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4'>
            <div>
              <CardTitle>Royalty Details</CardTitle>
              <p className='mt-1 text-muted-foreground'>
                All royalty payments for this release
              </p>
            </div>
            <div className='text-muted-foreground text-sm'>
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RoyaltiesTable releaseId={release.id} pageSize={10} />
        </CardContent>
      </Card>

      {/* Summary section */}
      <div className='mt-8 text-muted-foreground text-sm text-center'>
        <p>
          Royalty reports are updated monthly. Contact support if you notice any discrepancies.
        </p>
      </div>
    </div>
  );
}
