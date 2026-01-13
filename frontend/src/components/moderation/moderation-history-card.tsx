import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { ModerationRecord } from '@/types/api';

interface ModerationHistoryCardProps {
  record: ModerationRecord;
}

export function ModerationHistoryCard({ record }: ModerationHistoryCardProps) {

  return (
    <Card className=''>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-start'>
          <div className='space-y-1'>
            <div className='text-muted-foreground text-sm'>
              By {record.moderatorName} on{' '}
              {new Date(record.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm whitespace-pre-wrap'>{record.comment}</p>
      </CardContent>
    </Card>
  );
}
