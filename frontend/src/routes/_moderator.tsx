// src/routes/_moderator.tsx
import { createFileRoute } from '@tanstack/react-router';
import { moderatorGuard } from '@/lib/route-guards';
import { AdminLayout } from '@/components/layouts/admin-layout';

export const Route = createFileRoute('/_moderator')({
  beforeLoad: async () => {
    await moderatorGuard();
  },
  component: AdminLayout,
});
