// src/routes/_auth.tsx
import { createFileRoute } from '@tanstack/react-router';
import { getAuthToken } from '@/services/api';
import { AuthLayout } from '@/components/layouts/auth-layout';

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    const token = getAuthToken();
    if (token) {
      throw new Error('Already authenticated');
    }
  },
  component: AuthLayout,
  errorComponent: ({ error }) => {
    if (error.message === 'Already authenticated') {
      // Redirect to appropriate dashboard based on user type
      // This will be handled by the root route redirect logic
      return null;
    }
    return <div>Error: {error.message}</div>;
  },
});
