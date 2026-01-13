// src/components/releases/release-detail-content.tsx
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
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { LabelDisplay } from '@/components/label/label-display';
import {
  useGetReleaseById,
  useGetReleaseSongs,
  useRequestReleaseModeration,
} from '@/hooks/use-release-hooks';
import { useGetArtistById } from '@/hooks/use-artists';
import { UploadCoverButton } from '@/components/releases/upload-cover-button';
import { ReleaseCoverImage } from '@/components/releases/release-cover-image';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { AddSongModal } from '@/components/releases/add-song-modal';
import { formatDuration } from '@/lib/utils';
import { toast } from 'sonner';
import { ModerationHistoryCard } from '@/components/moderation/moderation-history-card';
import { useModerationHistory } from '@/hooks/use-moderation-release-hooks';
import { queryClient } from '@/providers/query-client';

export interface ReleaseDetailContentProps {
  releaseId: number;
  onBack: () => void;
  onEdit: () => void;
  readOnly?: boolean;
}

export function ReleaseDetailContent({
  releaseId,
  onBack,
  onEdit,
  readOnly = false
}: ReleaseDetailContentProps) {
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const { mutate: requestModeration, isPending: isModerationPending } = useRequestReleaseModeration();
  const { data: history } = useModerationHistory(releaseId);

  const handleSongAdded = async () => {
    await refetchSongs();
  };

  const handleSubmitForModeration = () => {
    setIsSubmitting(true);
    requestModeration(releaseId, {
      onSuccess: () => {
        toast.success('Release submitted for moderation successfully!');
        queryClient.invalidateQueries({ queryKey: ['release', releaseId] });
        queryClient.invalidateQueries({ queryKey: ['artist-releases'] });
      },
      onError: (error) => {
        toast.error('Failed to submit release for moderation', {
          description: error.response?.data?.message || 'Please try again later'
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  const canEdit = !readOnly &&
    release &&
    (release.moderationState === 'DRAFT' ||
      release.moderationState === "WAITING_FOR_CHANGES");

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

  return (
    <div className="mx-auto py-8 max-w-4xl container">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Releases
      </Button>

      <div className='flex flex-col gap-4'>
        <Card>
          <CardHeader className="flex flex-row justify-between items-start pt-4">
            <div>
              <CardTitle className="text-2xl">{release.name}</CardTitle>
              <CardDescription>
                {release.genre} • {release.releaseType.replace('_', ' ')}
              </CardDescription>
            </div>
            <Badge variant={canEdit ? 'secondary' : 'default'}>
              {release.moderationState}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-start gap-8 px-8">
              <ReleaseCoverImage
                releaseId={releaseId}
                releaseName={release.name}
                alt={`Cover for ${release.name}`}
                width={240}
                height={240}
                fallback={!readOnly ? <UploadCoverButton releaseId={releaseId} /> : null}
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

                {artist && canEdit && (
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
                          {formatDuration(song.songLengthSeconds)} •{" "}
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
                    {canEdit
                      ? 'No songs added yet. Click "Add Song" to get started.'
                      : 'This release has no songs yet.'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            {canEdit && (
              <Button variant="outline" onClick={onEdit}>
                <Pencil className="mr-2 w-4 h-4" />
                Edit Release
              </Button>
            )}

            {canEdit && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isSubmitting || isModerationPending}
                    className="gap-2"
                  >
                    {isSubmitting || isModerationPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="w-4 h-4" />
                        Submit for Approval
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit for Moderation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to submit this release for approval?
                      Once submitted, you won't be able to make changes until it's reviewed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSubmitForModeration}
                      disabled={isSubmitting || isModerationPending}
                    >
                      {isSubmitting || isModerationPending ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit for Approval'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation History</CardTitle>
            <CardDescription>
              Previous moderation actions for this release
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history && history.length > 0 ? (
              <div className='space-y-4'>
                {history.map((record) => (
                  <ModerationHistoryCard
                    key={record.id}
                    record={record}
                  />
                ))}
              </div>
            ) : (
              <div className='py-8 text-muted-foreground text-center'>
                No moderation history yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
