// src/routes/_artist/artist/royalties.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReleaseCoverImage } from '@/components/releases/release-cover-image';
import { useAuth } from '@/hooks/use-auth';
import { useGetReleasesByArtistId } from '@/hooks/use-release-hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetArtistByUserId } from '@/hooks/use-artists';
import type { Release } from '@/types/api';
import { DollarSign, Eye } from 'lucide-react';

export const Route = createFileRoute('/_artist/artist/royalties/')({
  component: ArtistRoyaltiesPage,
});

function ArtistRoyaltiesPage() {
  const { data: user } = useAuth();
  const { data: artist, isLoading: isArtistLoading, error: artistError } = useGetArtistByUserId(user?.id);
  const artistId = artist?.id;
  const navigate = useNavigate();

  const {
    data: releasesData,
    isLoading: isReleasesLoading,
    error: releasesError
  } = useGetReleasesByArtistId(artistId, 0, 10);

  const isLoading = isArtistLoading || isReleasesLoading;
  const error = artistError || releasesError;
  const releases = releasesData?.content || [];

  // Skeleton loader for the entire page
  if (isLoading) {
    return (
      <div className='py-8 container'>
        <Skeleton className='mb-8 w-64 h-10' /> {/* Page title skeleton */}

        {/* Releases table skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='w-48 h-8' />
          </CardHeader>
          <CardContent>
            <div className='border rounded-lg overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {[...Array(5)].map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className='w-24 h-6' />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {[...Array(5)].map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className='w-full h-8' />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error handling
  if (error || !artistId) {
    return (
      <div className='py-8 text-center container'>
        <h2 className='mb-4 font-bold text-destructive text-2xl'>
          {error ? 'Failed to load artist data' : 'Artist profile not found'}
        </h2>
        <p className='text-muted-foreground'>
          {error?.message ||
            'Please complete your artist profile to view royalties information'}
        </p>
      </div>
    );
  }

  // No releases found
  if (releases.length === 0) {
    return (
      <div className='px-8 py-8 text-center'>
        <div className='flex justify-center mb-8'>
          <div className='bg-muted p-4 rounded-full'>
            <DollarSign className='w-12 h-12 text-muted-foreground' />
          </div>
        </div>
        <h1 className='mb-4 font-bold text-3xl tracking-tight'>Your Royalties</h1>
        <div className='mx-auto py-12 max-w-2xl'>
          <div className='mb-4 text-muted-foreground text-lg'>
            You don't have any releases yet
          </div>
          <div className='text-muted-foreground italic'>
            Once your releases are created and approved,
            you'll be able to view royalty information here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='px-8 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='font-bold text-3xl tracking-tight'>Your Royalties</h1>
          <p className='mt-1 text-muted-foreground'>
            View royalty information for all your releases
          </p>
        </div>
      </div>

      <Card className='hover:shadow-md transition-shadow duration-300'>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle className='flex items-center gap-2 text-xl'>
                {artist?.name}
                <Badge variant='secondary' className='font-normal text-xs'>
                  {releases.length} {releases.length === 1 ? 'release' : 'releases'}
                </Badge>
              </CardTitle>
              <p className='mt-1 text-muted-foreground'>
                Royalty information for all your releases
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className='border rounded-lg overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Release</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Skeleton className='rounded w-12 h-12' />
                          <div>
                            <Skeleton className='mb-1 w-32 h-4' />
                            <Skeleton className='w-20 h-3' />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className='w-24 h-4' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='w-20 h-4' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='w-20 h-6' />
                      </TableCell>
                      <TableCell className='text-right'>
                        <Skeleton className='ml-auto w-20 h-8' />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='border rounded-lg overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>Release</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {releases.map((release) => (
                    <ReleaseRoyaltyRow
                      key={release.id}
                      release={release}
                      artistName={artist?.name || ''}
                      navigate={navigate}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Component for each release row in the royalties table
function ReleaseRoyaltyRow({
  release,
  artistName,
  navigate
}: {
  release: Release;
  artistName: string;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <TableRow className='hover:bg-muted/50 transition-colors'>
      <TableCell>
        <div className='flex items-center gap-3'>
          <div className='relative shrink-0 w-12 h-12'>
            <ReleaseCoverImage
              releaseId={release.id}
              releaseName={release.name}
              className='rounded w-full h-full object-cover'
              fallback={
                <div className='flex justify-center items-center bg-muted rounded w-full h-full text-xs'>
                  No cover
                </div>
              }
            />
          </div>
          <div className='max-w-[150px] truncate'>
            <div className='font-medium truncate'>{release.name}</div>
            <div className='text-muted-foreground text-xs truncate'>{artistName}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className='font-medium'>{release.releaseType.replace('_', ' ')}</div>
          <div className='text-muted-foreground text-xs'>
            UPC: {release.releaseUpc}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className='font-medium'>
          {new Date(release.date).toLocaleDateString()}
        </div>
        <div className='text-muted-foreground text-xs'>
          {new Date(release.date).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={
          release.moderationState === 'APPROVED'
            ? 'default'
            : release.moderationState === 'DRAFT'
              ? 'secondary'
              : 'destructive'
        }>
          {release.moderationState.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell className='text-right'>
        <Button
          variant='outline'
          size='sm'
          className='gap-1'
          onClick={(e) => {
            e.stopPropagation();
            navigate({
              to: '/artist/royalties/$releaseId',
              params: { releaseId: release.id.toString() },
            });
          }}
        >
          <Eye className='w-3.5 h-3.5' />
          <span className='hidden sm:inline'>View Royalties</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
