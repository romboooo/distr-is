// src/app.tsx
import { useAuth } from '@/hooks/use-auth';
import { router } from '@/providers/router';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '@/providers/query-client';
import type { RouterContext } from '@/lib/router-context';

export function App() {
  const auth = useAuth();

  // Create context that matches RouterContext interface
  const context: RouterContext = {
    auth: {
      isAuthenticated: auth.isAuthenticated,
      user: auth.user || null,
      logout: auth.logout,
    },
    queryClient,
  };

  return <RouterProvider router={router} context={context} />;
}
