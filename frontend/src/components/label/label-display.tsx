// src/components/label/label-display.tsx
import { useGetLabelById } from '@/hooks/use-label-hooks';
import { Loader2 } from 'lucide-react';

interface LabelDisplayProps {
  labelId: number;
}

export function LabelDisplay({ labelId }: LabelDisplayProps) {
  const { data: label, isLoading, isError, error } = useGetLabelById(labelId);

  if (isLoading) {
    return (
      <div className='flex justify-center p-4'>
        <Loader2 className='w-5 h-5 text-muted-foreground animate-spin' />
      </div>
    );
  }

  if (isError || !label) {
    return (
      <div className='bg-destructive/10 p-3 rounded-md text-destructive text-sm'>
        Error loading label details: {error?.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className='bg-muted p-3 border rounded-md'>
      <p className='font-medium'>{label.contactName}</p>
      <p className='text-muted-foreground text-sm'>
        {label.country} • {label.phone}
      </p>
    </div>
  );
}
