import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateLabel } from '@/hooks/use-user-detail-hooks';
import { toast } from 'sonner';
import type { Artist } from '@/types/api';

interface SelfLabelCreationDialogProps {
  userId: number;
  artistDetails?: Artist | null;
  onLabelCreated: () => void;
}

export function SelfLabelCreationDialog({
  userId,
  artistDetails,
  onLabelCreated,
}: SelfLabelCreationDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [country, setCountry] = useState(artistDetails?.country || '');
  const [contactName, setContactName] = useState(artistDetails?.name || '');
  const [phone, setPhone] = useState('');

  const createLabelMutation = useCreateLabel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createLabelMutation.mutateAsync({
        country,
        contactName,
        phone,
        userId,
      });

      toast.success('Self-label created successfully!');
      setIsDialogOpen(false);
      onLabelCreated();
    } catch {
      toast.error('Failed to create self-label. Please try again.');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className='w-full'>Create Self-Label</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Self-Label</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='contactName'>Label Contact Name</Label>
            <Input
              id='contactName'
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={artistDetails?.name || 'Your Artist Name'}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='country'>Country</Label>
            <Input
              id='country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={artistDetails?.country || 'Country'}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>Contact Phone</Label>
            <Input
              id='phone'
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='+1 (555) 123-4567'
              required
            />
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={createLabelMutation.isPending}
          >
            {createLabelMutation.isPending ? 'Creating...' : 'Create Label'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
