import { createLazyFileRoute } from '@tanstack/react-router';
import { PendingReleasesTable } from '@/components/moderation/pending-releases-table';

export const Route = createLazyFileRoute('/_moderator/moderation/')({
  component: ModerationPage,
});

function ModerationPage() {
  return (
    <div className='p-8 container'>
      <PendingReleasesTable pageSize={10} />
    </div>
  );
}
