// src/routes/_artist/artist/releases/index.lazy.tsx
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { ReleaseCoverImage } from '@/components/releases/release-cover-image';
import { useAuth } from '@/hooks/use-auth';
import { useGetReleasesByArtistId } from '@/hooks/use-release-hooks';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useArtistByUserId } from '@/hooks/use-user-detail-hooks';

export const Route = createLazyFileRoute('/_artist/artist/releases/')({
  component: ArtistReleasesPage,
});

function ArtistReleasesPage() {
  const { data: user } = useAuth();
  const { data: artist } = useArtistByUserId(user?.id || 0, !!user);
  const artistId = artist?.id;
  const navigate = useNavigate();
  const { data: releasesData, isLoading, error } = useGetReleasesByArtistId(
    artistId || 0,
    0,
    20
  );

  const releases = releasesData?.content || [];

  if (isLoading) {
    return (
      <div className="py-8 container">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="w-48 h-10" />
          <Skeleton className="w-32 h-10" />
        </div>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full aspect-square" />
              <CardHeader>
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="mt-2 w-1/2 h-4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !artistId) {
    return (
      <div className="py-8 text-center container">
        <h2 className="mb-4 font-bold text-destructive text-2xl">
          {error ? 'Failed to load releases' : 'Artist profile not found'}
        </h2>
        <p className="text-muted-foreground">
          {error?.message || 'Please complete your artist profile to view releases'}
        </p>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="font-bold text-3xl tracking-tight">My Releases</h1>
        <Button
          size="lg"
          onClick={() => navigate({ to: '/artist/releases/new' })}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Release
        </Button>
      </div>

      {releases.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-muted-foreground">
            You don't have any releases yet
          </div>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/artist/releases/new' })}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create First Release
          </Button>
        </div>
      ) : (
        <div className='flex justify-center items-center'>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-[80%]"
          >
            <CarouselContent>
              {releases.map((release) => (
                <CarouselItem
                  key={release.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="p-2">
                    <Card className="hover:shadow-md pt-0 border hover:scale-105 transition-all">
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <ReleaseCoverImage
                            releaseId={release.id}
                            releaseName={release.name}
                            className="w-full h-full object-cover"
                            fallback={
                              <div className="p-4 text-muted-foreground text-center">
                                No cover image
                              </div>
                            }
                          />
                          <div className="top-2 right-2 absolute">
                            <Badge variant={
                              release.moderationState === 'APPROVED' ? 'default' :
                                release.moderationState === 'DRAFT' ? 'secondary' :
                                  'destructive'
                            }>
                              {release.moderationState.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">{release.name}</CardTitle>
                        <div className="mt-1 text-muted-foreground text-sm">
                          {new Date(release.date).toLocaleDateString()}
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center pt-2">
                        <div className="font-medium text-sm">
                          {release.releaseType.replace('_', ' ')}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate({
                            to: '/artist/releases/$releaseId',
                            params: { releaseId: release.id.toString() }
                          })}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
}
