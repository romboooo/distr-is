// src/routes/_auth.tsx
import { createFileRoute } from '@tanstack/react-router';
import { AuthLayout } from '@/components/layouts/auth-layout';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  errorComponent: ({ error }) => {
    if (error.message === 'Already authenticated') {
      return null;
    }
    return <div>Error: {error.message}</div>;
  },
});
