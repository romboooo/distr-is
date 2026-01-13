// src/routes/_label/label/royalties.tsx
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
import { useGetLabelByUserId } from '@/hooks/use-label-hooks';
import type { Artist, Release } from '@/types/api';
import { useState } from 'react';
import { useGetArtistsByLabelId } from '@/hooks/use-artists';
import { DollarSign, Eye } from 'lucide-react';

export const Route = createFileRoute('/_label/label/royalties/')({
  component: LabelRoyaltiesPage,
});

function LabelRoyaltiesPage() {
  const { data: user } = useAuth();
  const { data: label, isLoading: isLabelLoading, error: labelError } = useGetLabelByUserId(user?.id);
  const labelId = label?.id;

  const {
    data: artistsData,
    isLoading: isArtistsLoading,
    error: artistsError
  } = useGetArtistsByLabelId(labelId, 0, 10);

  const [expandedArtist, setExpandedArtist] = useState<number | null>(null);
  const navigate = useNavigate();

  const isLoading = isLabelLoading || isArtistsLoading;
  const error = labelError || artistsError;
  const artists = artistsData?.content || [];

  if (isLoading) {
    return (
      <div className='py-8 container'>
        <Skeleton className='mb-8 w-64 h-10' /> {/* Page title skeleton */}

        {/* Artist sections skeleton */}
        {[...Array(3)].map((_, artistIndex) => (
          <div key={artistIndex} className='mb-12'>
            <Skeleton className='mb-4 w-48 h-8' /> {/* Artist name skeleton */}
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
                  {[...Array(3)].map((_, rowIndex) => (
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
          </div>
        ))}
      </div>
    );
  }

  if (error || !labelId) {
    return (
      <div className='py-8 text-center container'>
        <h2 className='mb-4 font-bold text-destructive text-2xl'>
          {error ? 'Failed to load label data' : 'Label profile not found'}
        </h2>
        <p className='text-muted-foreground'>
          {error?.message ||
            'Please complete your label profile to view royalties information'}
        </p>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className='px-8 py-8 text-center'>
        <div className='flex justify-center mb-8'>
          <div className='bg-muted p-4 rounded-full'>
            <DollarSign className='w-12 h-12 text-muted-foreground' />
          </div>
        </div>
        <h1 className='mb-4 font-bold text-3xl tracking-tight'>Label Royalties</h1>
        <div className='mx-auto py-12 max-w-2xl'>
          <div className='mb-4 text-muted-foreground text-lg'>
            No artists found in your label
          </div>
          <div className='text-muted-foreground italic'>
            Once you add artists to your label and they release music,
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
          <h1 className='font-bold text-3xl tracking-tight'>Label Royalties</h1>
          <p className='mt-1 text-muted-foreground'>
            View royalty information for all releases under your label
          </p>
        </div>
      </div>

      <div className='space-y-8'>
        {artists.map((artist) => (
          <ArtistRoyaltiesSection
            key={artist.id}
            artist={artist}
            isExpanded={expandedArtist === artist.id}
            onToggleExpand={() => setExpandedArtist(
              expandedArtist === artist.id ? null : artist.id
            )}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
}

function ArtistRoyaltiesSection({
  artist,
  isExpanded,
  onToggleExpand,
}: {
  artist: Artist;
  isExpanded: boolean;
  onToggleExpand: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const {
    data: releasesData,
    isLoading,
    error
  } = useGetReleasesByArtistId(artist.id, 0, isExpanded ? 20 : 5);

  const releases = releasesData?.content || [];

  if (error) {
    return (
      <Card className='border-destructive/50'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <span>{artist.name}</span>
            <Badge variant='destructive'>Error loading data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-destructive'>
            Failed to load releases: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='hover:shadow-md transition-shadow duration-300'>
      <CardHeader className='pb-4 cursor-pointer' onClick={onToggleExpand}>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className='flex items-center gap-2 text-xl'>
              {artist.name}
              <Badge variant='secondary' className='font-normal text-xs'>
                {releases.length} {releases.length === 1 ? 'release' : 'releases'}
              </Badge>
            </CardTitle>
            <p className='mt-1 text-muted-foreground'>
              Royalty information for all releases by {artist.name}
            </p>
          </div>
          <Button variant='ghost' size='sm' className='transition-transform duration-300 transform'>
            {isExpanded ? '▲ Collapse' : '▼ Expand'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
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
          ) : releases.length === 0 ? (
            <div className='py-12 text-muted-foreground text-center'>
              <div className='mb-4 text-lg'>No releases found for this artist</div>
              <div>Releases will appear here once they are created and approved</div>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {releases.map((release) => (
                    <ReleaseRoyaltyRow
                      key={release.id}
                      release={release}
                      artistName={artist.name}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function ReleaseRoyaltyRow({
  release,
  artistName,
}: {
  release: Release;
  artistName: string;
}) {
  const navigate = useNavigate();

  return (
    <TableRow className='hover:bg-muted/50 transition-colors'>
      <TableCell>
        <div className='flex items-center gap-3'>
          <div className='relative w-12 h-12 shrink-0'>
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
              to: '/label/royalties/$releaseId',
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
