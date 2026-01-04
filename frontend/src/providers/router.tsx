// src/providers/router.tsx
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { queryClient } from '@/providers/query-client';
import type { RouterContext } from '@/lib/router-context';

export const router = createRouter({
  routeTree,
  context: {
    // These are dummy values for typing - actual values come from RouterProvider
    auth: {
      isAuthenticated: false,
      user: null,
      logout: async () => {},
    },
    queryClient,
  } satisfies RouterContext,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 30_000,
});
