// src/routes/_user.tsx
import { createFileRoute } from '@tanstack/react-router';
import { labelGuard } from '@/lib/route-guards';
import { LabelLayout } from '@/components/layouts/label-layout';

export const Route = createFileRoute('/_label')({
  beforeLoad: async ({ context }) => {
    await labelGuard(context);
  },
  component: LabelLayout,
});
