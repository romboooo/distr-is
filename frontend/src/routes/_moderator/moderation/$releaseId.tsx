import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import {
  useModerationHistory,
  useRelease,
  useModerateRelease,
  useGetModeratorIdByUserId,
} from '@/hooks/use-moderation-release-hooks';
import { ReleaseCoverImage } from '@/components/releases/release-cover-image';
import { ModerationHistoryCard } from '@/components/moderation/moderation-history-card';
import { useGetArtistById } from '@/hooks/use-artists';
import { useGetLabelById } from '@/hooks/use-label-hooks';
import { SongList } from '@/components/moderation/song-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export const Route = createFileRoute('/_moderator/moderation/$releaseId')({
  component: ReleaseDetails,
});

function ReleaseDetails() {
  const { releaseId } = Route.useParams();
  const { data: auth } = useAuth();
  const { data: moderatorId } = useGetModeratorIdByUserId(auth?.id);
  const parsedReleaseId = parseInt(releaseId);
  const { data: release, isLoading: isLoadingRelease } =
    useRelease(parsedReleaseId);
  const { data: history, isLoading: isLoadingHistory } =
    useModerationHistory(parsedReleaseId);
  const { data: artistData } = useGetArtistById(release?.artistId);
  const { data: labelData } = useGetLabelById(release?.labelId);
  const { mutate: moderateRelease, isPending: isModerating } =
    useModerateRelease();
  const navigate = useNavigate();

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<
    'APPROVED' | 'REJECTED' | 'WAITING_FOR_CHANGES'
  >('APPROVED');
  const [comment, setComment] = useState('');

  const handleModerationSubmit = () => {
    if (!release || !moderatorId) return;

    moderateRelease(
      {
        moderatorId: moderatorId,
        releaseId: release.id,
        moderationState: selectedState,
        comment: comment.trim() || 'No comment provided',
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setComment('');
        },
      },
    );

    navigate({ to: '/moderation' });
  };

  if (isLoadingRelease || isLoadingHistory) {
    return (
      <div className='p-8 container'>
        <div className='gap-8 grid'>
          <div className='flex items-center gap-4'>
            <Skeleton className='rounded-full w-10 h-10' />
            <div className='space-y-2'>
              <Skeleton className='w-64 h-6' />
              <Skeleton className='w-48 h-4' />
            </div>
          </div>
          <div className='gap-6 grid md:grid-cols-3'>
            <div className='space-y-6 md:col-span-2'>
              <Card>
                <CardHeader>
                  <Skeleton className='w-48 h-6' />
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Skeleton className='w-32 h-4' />
                    <Skeleton className='w-full h-12' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='w-32 h-4' />
                    <Skeleton className='w-full h-12' />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className='w-48 h-6' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='w-full h-48' />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className='w-48 h-6' />
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className='flex items-center gap-4'>
                        <Skeleton className='rounded w-12 h-12' />
                        <div className='flex-1 space-y-2'>
                          <Skeleton className='w-32 h-4' />
                          <Skeleton className='w-24 h-3' />
                        </div>
                        <Skeleton className='w-20 h-8' />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <Skeleton className='w-32 h-6' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='w-full h-24' />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className='w-32 h-6' />
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className='space-y-2'>
                        <Skeleton className='w-24 h-4' />
                        <Skeleton className='w-full h-4' />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!release) {
    return (
      <div className='p-8 text-center container'>
        <AlertTriangle className='mx-auto mb-4 w-12 h-12 text-destructive' />
        <h1 className='mb-2 font-bold text-2xl'>Release Not Found</h1>
        <p className='mb-6 text-muted-foreground'>
          The release with ID {releaseId} could not be found or you don't have
          permission to view it.
        </p>
        <Button asChild>
          <Link to='/moderation'>Back to Pending Releases</Link>
        </Button>
      </div>
    );
  }

  // Only show moderation actions if the release is in a modifiable state
  const canModerate = ['ON_MODERATION', 'ON_REVIEW'].includes(
    release.moderationState,
  );

  return (
    <div className='p-8 container'>
      <Button variant='ghost' asChild className='mb-6'>
        <Link to='/moderation'>
          <ArrowLeft className='mr-2 w-4 h-4' />
          Back to Pending Releases
        </Link>
      </Button>

      <div className='gap-8 grid'>
        {/* Release Header */}
        <div className='flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4'>
          <div>
            <h1 className='font-bold text-2xl'>{release.name}</h1>
            <p className='text-muted-foreground'>
              ID: {release.id} • Artist: {artistData?.name} • Label:{' '}
              {labelData?.contactName}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Badge
              variant='secondary'
              className={cn(
                'px-3 py-1 font-medium text-lg',
                release.moderationState === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : release.moderationState === 'REJECTED'
                    ? 'bg-red-100 text-red-800'
                    : release.moderationState === 'WAITING_FOR_CHANGES'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800',
              )}
            >
              {release.moderationState.replace('_', ' ')}
            </Badge>
            <Badge
              variant='secondary'
              className={cn(
                'px-3 py-1 font-medium text-lg',
                release.releaseType === 'ALBUM'
                  ? 'bg-blue-100 text-blue-800'
                  : release.releaseType === 'SINGLE'
                    ? 'bg-green-100 text-green-800'
                    : release.releaseType === 'EP'
                      ? 'bg-purple-100 text-purple-800'
                      : release.releaseType === 'MAXI_SINGLE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-pink-100 text-pink-800',
              )}
            >
              {release.releaseType}
            </Badge>
          </div>
        </div>

        <div className='gap-6 grid md:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 md:col-span-2'>
            {/* Release Details */}
            <Card>
              <CardHeader>
                <CardTitle>Release Details</CardTitle>
                <CardDescription>
                  Information about this release submission
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Genre</Label>
                    <p className='font-medium'>{release.genre || 'N/A'}</p>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>UPC/EAN</Label>
                    <p className='font-mono font-medium'>
                      {release.releaseUpc || 'N/A'}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>
                      Submission Date
                    </Label>
                    <p className='font-medium'>
                      {new Date(release.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Label</Label>
                    <p className='font-medium'>{labelData?.contactName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Art */}
            {release.coverPath && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Art</CardTitle>
                  <CardDescription>
                    Visual representation of the release
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReleaseCoverImage
                    releaseId={release.id}
                    releaseName={release.name}
                    alt={`Cover for ${release.name}`}
                    className=''
                    width={240}
                    height={240}
                    fallback={release.name}
                  />
                </CardContent>
              </Card>
            )}

            {/* Songs */}
            <Card>
              <CardHeader>
                <CardTitle>Tracks</CardTitle>
                <CardDescription>
                  List of songs included in this release
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SongList releaseId={parsedReleaseId} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Moderation Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Moderation Actions</CardTitle>
                <CardDescription>
                  Review this release and take action
                </CardDescription>
              </CardHeader>
              <CardContent>
                {canModerate ? (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className='w-full' size='lg'>
                        <Clock className='mr-2 w-5 h-5' />
                        Take Moderation Action
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[500px]'>
                      <DialogHeader>
                        <DialogTitle>Moderate Release</DialogTitle>
                        <DialogDescription>
                          Select a moderation status and provide a comment for
                          the artist/label.
                        </DialogDescription>
                      </DialogHeader>
                      <div className='space-y-6 py-4'>
                        <div className='space-y-2'>
                          <Label>Moderation Status</Label>
                          <RadioGroup
                            value={selectedState}
                            onValueChange={(value) =>
                              setSelectedState(
                                value as
                                | 'APPROVED'
                                | 'REJECTED'
                                | 'WAITING_FOR_CHANGES',
                              )
                            }
                            className='space-y-3'
                          >
                            <div className='flex items-center space-x-3'>
                              <RadioGroupItem
                                value='APPROVED'
                                id='approved'
                                className='border-green-500'
                              />
                              <Label
                                htmlFor='approved'
                                className='flex items-center gap-2 font-medium cursor-pointer'
                              >
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Approve Release
                              </Label>
                            </div>
                            <div className='flex items-center space-x-3'>
                              <RadioGroupItem
                                value='WAITING_FOR_CHANGES'
                                id='waiting'
                                className='border-yellow-500'
                              />
                              <Label
                                htmlFor='waiting'
                                className='flex items-center gap-2 font-medium cursor-pointer'
                              >
                                <Clock className='w-5 h-5 text-yellow-500' />
                                Request Changes
                              </Label>
                            </div>
                            <div className='flex items-center space-x-3'>
                              <RadioGroupItem
                                value='REJECTED'
                                id='rejected'
                                className='border-red-500'
                              />
                              <Label
                                htmlFor='rejected'
                                className='flex items-center gap-2 font-medium cursor-pointer'
                              >
                                <XCircle className='w-5 h-5 text-red-500' />
                                Reject Release
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='comment'>
                            Comment to Artist/Label
                          </Label>
                          <Textarea
                            id='comment'
                            placeholder='Provide detailed feedback about your decision...'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className='min-h-[120px]'
                          />
                          <p className='text-muted-foreground text-sm'>
                            {comment.length}/500 characters
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleModerationSubmit}
                          disabled={isModerating || comment.length > 500}
                        >
                          {isModerating && (
                            <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                          )}
                          {isModerating ? 'Processing...' : 'Submit Decision'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className='py-6 text-muted-foreground text-center'>
                    {release.moderationState === 'APPROVED' && (
                      <>
                        <CheckCircle className='mx-auto mb-2 w-10 h-10 text-green-500' />
                        <p>This release has been approved</p>
                      </>
                    )}
                    {release.moderationState === 'REJECTED' && (
                      <>
                        <XCircle className='mx-auto mb-2 w-10 h-10 text-red-500' />
                        <p>This release has been rejected</p>
                      </>
                    )}
                    {release.moderationState === 'WAITING_FOR_CHANGES' && (
                      <>
                        <Clock className='mx-auto mb-2 w-10 h-10 text-yellow-500' />
                        <p>Changes have been requested for this release</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Moderation History */}
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
                      <ModerationHistoryCard key={record.id} record={record} />
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
      </div>
    </div>
  );
}
