// src/routes/_artist/artist/releases/$releaseId.tsx
import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { Loader2, AlertCircle, ArrowLeft, Pencil, Plus, Music } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { LabelDisplay } from '@/components/label/label-display';
import { queryClient } from '@/providers/query-client';
import { getReleaseById } from '@/services/releases';
import {
  useGetReleaseById,
  useGetReleaseSongs
} from '@/hooks/use-release-hooks';
import { useGetArtistById } from '@/hooks/use-artists';
import { UploadCoverButton } from '@/components/releases/upload-cover-button';
import { ReleaseCoverImage } from '@/components/releases/release-cover-image';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { AddSongModal } from '@/components/releases/add-song-modal';

export const Route = createFileRoute('/_artist/artist/releases/$releaseId/')({
  component: ReleaseDetailPage,
  loader: async ({ params }) => {
    const { releaseId } = params;
    const id = parseInt(releaseId);

    if (isNaN(id) || id <= 0) {
      throw new Error('Invalid release ID');
    }

    await queryClient.ensureQueryData({
      queryKey: ['release', id],
      queryFn: () => getReleaseById(id),
    });

    return {
      releaseId: id,
    };
  },
});



function ReleaseDetailPage() {
  const { releaseId } = Route.useLoaderData();
  const navigate = useNavigate();
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);

  const {
    data: release,
    isLoading,
    isError,
    error,
  } = useGetReleaseById(releaseId);

  const { data: artist } = useGetArtistById(release?.artistId);
  const {
    data: songs,
    isLoading: songsLoading,
    refetch: refetchSongs
  } = useGetReleaseSongs(releaseId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 container">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (isError || !release) {
    return (
      <div className="mx-auto py-8 max-w-2xl container">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to load release details'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  function handleEdit(): void {
    navigate({
      to: '/artist/releases/$releaseId/edit',
      params: { releaseId: releaseId.toString() }
    });
  }

  const handleSongAdded = async () => {
    await refetchSongs();
  };

  return (
    <div className="mx-auto py-8 max-w-4xl container">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/artist/releases' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Releases
      </Button>

      <Card>
        <CardHeader className="flex flex-row justify-between items-start pt-4">
          <div>
            <CardTitle className="text-2xl">{release.name}</CardTitle>
            <CardDescription>
              {release.genre} • {release.releaseType.replace('_', ' ')}
            </CardDescription>
          </div>
          <Badge variant={release.moderationState === 'DRAFT' ? 'secondary' : 'default'}>
            {release.moderationState}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-start gap-8 px-8">
            <ReleaseCoverImage
              releaseId={releaseId}
              releaseName={release.name}
              alt={`Cover for ${release.name}`}
              className=""
              width={240}
              height={240}
              fallback={<UploadCoverButton releaseId={releaseId} />}
            />
            <div className='flex flex-col gap-2'>
              <div className="flex gap-2">
                <Label className="font-medium text-lg">Artist</Label>
                <Label className="text-muted-foreground">{artist?.name || 'Unknown Artist'}</Label>
              </div>

              <div className="flex gap-2">
                <Label className="font-medium text-lg">Release Date</Label>
                <Label className="text-muted-foreground">
                  {release.date
                    ? new Date(release.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                    : 'Not set'}
                </Label>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-lg">Label</h3>
                <LabelDisplay labelId={release.labelId} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">Songs</h3>

              {artist && release.moderationState === 'DRAFT' && (
                <>
                  <Button size="sm" className="gap-2" onClick={() => setIsAddSongModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Add Song
                  </Button>
                  <AddSongModal
                    artistId={artist.id}
                    releaseId={releaseId}
                    open={isAddSongModalOpen}
                    onOpenChange={setIsAddSongModalOpen}
                    onSuccess={handleSongAdded}
                  />
                </>
              )}
            </div>

            {songsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
              </div>
            ) : songs && songs.length > 0 ? (
              <ul className="space-y-2">
                {songs.map((song) => (
                  <li
                    key={song.id}
                    className="flex justify-between items-center bg-muted p-3 rounded-md"
                  >
                    <div>
                      <p className="flex items-center gap-2 font-medium">
                        <Music className="w-4 h-4 text-muted-foreground" />
                        {song.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {Math.floor(song.songLengthSeconds / 60)}:{(song.songLengthSeconds % 60).toString().padStart(2, '0')} •{" "}
                        {song.songUpc ? `UPC: ${song.songUpc}` : 'No UPC assigned'}
                      </p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        Author: {song.musicAuthor}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-muted py-8 rounded-lg text-center">
                <Music className="mx-auto mb-2 w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {release.moderationState === 'DRAFT'
                    ? 'No songs added yet. Click "Add Song" to get started.'
                    : 'This release has no songs yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          {release.moderationState === 'DRAFT' && (
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="mr-2 w-4 h-4" />
              Edit Release
            </Button>
          )}
          <Button disabled={release.moderationState !== 'DRAFT'}>
            Submit for Approval
          </Button>
        </CardFooter>
      </Card>
    </div >
  );
}
