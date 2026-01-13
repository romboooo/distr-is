'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { Release, ModerationState } from '@/types/api';
import { useModerateRelease } from '@/hooks/use-moderation-release-hooks';
import { useGetArtistById } from '@/hooks/use-artists';

interface ModerationDialogProps {
  release: Release | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const MODERATION_STATES: {
  value: ModerationState;
  label: string;
  description: string;
  color: string;
}[] = [
    {
      value: 'APPROVED',
      label: 'Approve',
      description: 'Release meets all requirements and can be published',
      color: 'text-green-600',
    },
    {
      value: 'REJECTED',
      label: 'Reject',
      description: 'Release violates policies and cannot be published',
      color: 'text-red-600',
    },
    {
      value: 'WAITING_FOR_CHANGES',
      label: 'Request Changes',
      description: 'Release needs modifications before approval',
      color: 'text-yellow-600',
    },
  ];

export function ModerationDialog({
  release,
  open,
  onOpenChange,
  onSuccess,
}: ModerationDialogProps) {
  const [comment, setComment] = React.useState('');
  const [moderationState, setModerationState] =
    React.useState<ModerationState>('APPROVED');
  const { mutate: moderateRelease, isPending } = useModerateRelease();
  const { data: artistData } = useGetArtistById(release?.artistId);

  React.useEffect(() => {
    if (open && release) {
      setComment('');
      setModerationState('APPROVED');
    }
  }, [open, release]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!release) return;

    if (!comment.trim()) {
      toast.error('Please provide a comment explaining your decision');
      return;
    }

    moderateRelease(
      {
        releaseId: release.id,
        comment: comment.trim(),
        moderationState,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  if (!release) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Moderate Release: {release.name}</DialogTitle>
          <div className='mt-1 text-muted-foreground text-sm'>
            ID: {release.id} • Artist: {artistData?.name} • Type:{' '}
            {release.releaseType}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='decision'>Moderation Decision</Label>
            <Select
              value={moderationState}
              onValueChange={(value) =>
                setModerationState(value as ModerationState)
              }
            >
              <SelectTrigger id='decision'>
                <SelectValue placeholder='Select a decision' />
              </SelectTrigger>
              <SelectContent>
                {MODERATION_STATES.map((state) => (
                  <SelectItem
                    key={state.value}
                    value={state.value}
                    className={state.color}
                  >
                    <div>
                      <div className='font-medium'>{state.label}</div>
                      <div className='text-muted-foreground text-xs'>
                        {state.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='comment'>Comment</Label>
            <Textarea
              id='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Provide detailed feedback for the artist/label...'
              className='min-h-[120px]'
              required
            />
            <p className='text-muted-foreground text-xs'>
              Your comment will be visible to the release owner and is required
              for audit purposes
            </p>
          </div>

          {moderationState === 'WAITING_FOR_CHANGES' && (
            <div className='bg-yellow-50 p-3 border border-yellow-200 rounded-md'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='mt-0.5 w-4 h-4 text-yellow-500 shrink-0' />
                <div className='text-sm'>
                  <p className='font-medium'>Important:</p>
                  <p>
                    Clearly specify what changes are needed in your comment.
                    The release owner will need to make these changes and
                    resubmit for review.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={handleSubmit}
            disabled={isPending || !comment.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Submit Decision'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
