// src/routes/_moderator.tsx
import { createFileRoute } from '@tanstack/react-router';
import { moderatorGuard } from '@/lib/route-guards';
import { ModeratorLayout } from '@/components/layouts/moderator-layout';

export const Route = createFileRoute('/_moderator')({
  beforeLoad: async ({ context }) => {
    await moderatorGuard(context);
  },
  component: ModeratorLayout,
});
