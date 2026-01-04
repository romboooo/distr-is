// src/routes/_admin.tsx
import { createFileRoute } from '@tanstack/react-router';
import { adminGuard } from '@/lib/route-guards';
import { AdminLayout } from '@/components/layouts/admin-layout';

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    await adminGuard();
  },
  component: AdminLayout,
});
