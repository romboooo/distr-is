// src/routes/_artist/artist/releases/new.tsx
import { createLazyFileRoute } from '@tanstack/react-router';
import { ArtistReleaseForm } from '@/components/artist/release-form';

export const Route = createLazyFileRoute('/_artist/artist/releases/new/')({
  component: ReleaseNewPage,
});

function ReleaseNewPage() {
  return (
    <div className='py-8 container'>
      <div className='mx-auto max-w-4xl'>
        <ArtistReleaseForm />
      </div>
    </div>
  );
}
