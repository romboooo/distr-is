// src/routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { RouterContext } from '@/lib/router-context';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = Route.useRouteContext().auth;

  // Handle global redirects based on auth state
  useEffect(() => {
    if (isAuthenticated && user) {
      const currentPath = window.location.pathname;

      // Redirect from auth pages if already logged in
      const authPaths = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
      ] as const;
      if (authPaths.some((path) => currentPath.startsWith(path))) {
        if (user.type === 'ARTIST' || user.type === 'LABEL') {
          navigate({ to: '/profile', replace: true });
        } else if (user.type === 'ADMIN' || user.type === 'MODERATOR') {
          navigate({ to: '/admin', replace: true });
        }
      }
    }
  }, [isAuthenticated, user, navigate]);

  return <Outlet />;
}
