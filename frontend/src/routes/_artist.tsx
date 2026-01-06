// src/routes/_artist.tsx
import { createFileRoute } from '@tanstack/react-router';
import { artistGuard } from '@/lib/route-guards';
import { ArtistLayout } from '@/components/layouts/artist-layout';

export const Route = createFileRoute('/_artist')({
  beforeLoad: async ({ context }) => {
    await artistGuard(context);
  },
  component: ArtistLayout,
});
