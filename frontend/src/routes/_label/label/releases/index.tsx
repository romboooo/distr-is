import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ReleaseCoverImage } from '@/components/releases/release-cover-image';
import { useAuth } from '@/hooks/use-auth';
import { useGetReleasesByArtistId } from '@/hooks/use-release-hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetLabelByUserId } from '@/hooks/use-label-hooks';
import type { Artist, Release } from '@/types/api';
import { useState } from 'react';
import { useGetArtistsByLabelId } from '@/hooks/use-artists';

export const Route = createFileRoute('/_label/label/releases/')({
  component: LabelReleasesPage,
});

function LabelReleasesPage() {
  const { data: user } = useAuth();
  const { data: label, isLoading: isLabelLoading, error: labelError } = useGetLabelByUserId(user?.id);
  const labelId = label?.id;

  const {
    data: artistsData,
    isLoading: isArtistsLoading,
    error: artistsError
  } = useGetArtistsByLabelId(labelId, 0, 10); // Fetch up to 10 artists

  const [expandedArtist, setExpandedArtist] = useState<number | null>(null);
  const navigate = useNavigate();

  const isLoading = isLabelLoading || isArtistsLoading;
  const error = labelError || artistsError;
  const artists = artistsData?.content || [];

  // Skeleton loader for the entire page
  if (isLoading) {
    return (
      <div className='py-8 container'>
        <Skeleton className='mb-8 w-64 h-10' /> {/* Page title skeleton */}

        {/* Artist sections skeleton */}
        {[...Array(3)].map((_, artistIndex) => (
          <div key={artistIndex} className='mb-12'>
            <Skeleton className='mb-4 w-48 h-8' /> {/* Artist name skeleton */}
            <div className='gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {[...Array(4)].map((_, releaseIndex) => (
                <Card key={releaseIndex} className='overflow-hidden'>
                  <Skeleton className='w-full aspect-square' />
                  <CardHeader>
                    <Skeleton className='w-3/4 h-6' />
                    <Skeleton className='mt-2 w-1/2 h-4' />
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error handling
  if (error || !labelId) {
    return (
      <div className='py-8 text-center container'>
        <h2 className='mb-4 font-bold text-destructive text-2xl'>
          {error ? 'Failed to load label data' : 'Label profile not found'}
        </h2>
        <p className='text-muted-foreground'>
          {error?.message ||
            'Please complete your label profile to view artists and releases'}
        </p>
      </div>
    );
  }

  // No artists found
  if (artists.length === 0) {
    return (
      <div className='px-8 py-8 text-center'>
        <h1 className='mb-8 font-bold text-3xl tracking-tight'>Label Releases</h1>
        <div className='py-12'>
          <div className='mb-4 text-muted-foreground text-lg'>
            You don't have any artists in your label yet
          </div>
          {/* Placeholder for future "Add Artist" functionality */}
          <div className='text-muted-foreground italic'>
            Artists will appear here once added to your label
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='px-8 py-8'>
      <div className='flex justify-between items-center mb-12'>
        <h1 className='font-bold text-3xl tracking-tight'>Label Releases</h1>
      </div>

      <div className='space-y-16'>
        {artists.map((artist) => (
          <ArtistSection
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

// Separate component for each artist's section
function ArtistSection({
  artist,
  isExpanded,
  onToggleExpand,
  navigate
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
  } = useGetReleasesByArtistId(artist.id, 0, isExpanded ? 20 : 5); // Load more when expanded

  const releases = releasesData?.content || [];

  // Error state for individual artist section
  if (error) {
    return (
      <div className='p-6 border rounded-lg'>
        <h2 className='mb-2 font-bold text-2xl'>{artist.name}</h2>
        <div className='text-destructive'>
          Failed to load releases: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className='hover:shadow-md p-6 border rounded-lg transition-all duration-300'>
      <div
        className='flex justify-between items-start mb-6 cursor-pointer'
        onClick={onToggleExpand}
      >
        <div>
          <h2 className='font-bold text-2xl'>{artist.name}</h2>
          <div className='text-muted-foreground'>
            {releases.length} {releases.length === 1 ? 'release' : 'releases'}
          </div>
        </div>
        <Button variant='ghost' size='sm' className='transition-transform duration-300 transform'>
          {isExpanded ? '▼' : '▶'}
        </Button>
      </div>

      {isLoading ? (
        <div className='gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {[...Array(isExpanded ? 8 : 4)].map((_, i) => (
            <Card key={i} className='overflow-hidden'>
              <Skeleton className='w-full aspect-square' />
              <CardHeader>
                <Skeleton className='w-3/4 h-6' />
                <Skeleton className='mt-2 w-1/2 h-4' />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : releases.length === 0 ? (
        <div className='py-8 text-muted-foreground text-center'>
          No releases yet for this artist
        </div>
      ) : (
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
          }}
          className='w-full'
        >
          <CarouselContent>
            {releases.map((release) => (
              <CarouselItem
                key={release.id}
                className='md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
              >
                <div className='p-2'>
                  <ReleaseCard release={release} navigate={navigate} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {releases.length > (isExpanded ? 8 : 4) && (
            <>
              <CarouselPrevious className='-left-4' />
              <CarouselNext className='-right-4' />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
}

// Reusable release card component
function ReleaseCard({
  release,
  navigate
}: {
  release: Release;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <Card className='flex flex-col hover:shadow-md border h-full transition-all'>
      <CardContent className='p-0 grow'>
        <div className='relative aspect-square'>
          <ReleaseCoverImage
            releaseId={release.id}
            releaseName={release.name}
            className='w-full h-full object-cover'
            fallback={
              <div className='flex justify-center items-center p-4 h-full text-muted-foreground text-center'>
                No cover image
              </div>
            }
          />
          <div className='top-2 right-2 z-10 absolute'>
            <Badge
              variant={
                release.moderationState === 'APPROVED'
                  ? 'default'
                  : release.moderationState === 'DRAFT'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {release.moderationState.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base line-clamp-1'>{release.name}</CardTitle>
        <div className='mt-1 text-muted-foreground text-xs'>
          {new Date(release.date).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardFooter className='flex justify-between items-center pt-2 pb-4'>
        <div className='font-medium text-xs'>
          {release.releaseType.replace('_', ' ')}
        </div>
        <Button
          variant='outline'
          size='sm'
          className='px-2 h-8 text-xs'
          onClick={(e) => {
            e.stopPropagation();
            navigate({
              to: '/label/releases/$releaseId',
              params: { releaseId: release.id.toString() },
            });
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
