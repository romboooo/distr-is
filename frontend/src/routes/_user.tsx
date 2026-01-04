// src/routes/_user.tsx
import { createFileRoute } from '@tanstack/react-router';
import { UserLayout } from '@/components/layouts/user-layout';
import { userGuard } from '@/lib/route-guards';

export const Route = createFileRoute('/_user')({
  beforeLoad: async () => {
    await userGuard();
  },
  component: UserLayout,
});
