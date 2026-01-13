import { ReleaseForm } from '@/components/artist/release-form';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_label/label/releases/new/')({
  component: ReleaseNewPage,
});

function ReleaseNewPage() {
  return (
    <div className="py-8 container">
      <div className="mx-auto max-w-4xl">
        <ReleaseForm />
      </div>
    </div>
  );
}
