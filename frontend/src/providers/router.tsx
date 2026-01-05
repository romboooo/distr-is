// src/providers/router.tsx
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import type { useAuth } from '@/hooks/use-auth';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof import('@/providers/router').router;
  }
}

export type RouterContext = {
  auth: ReturnType<typeof useAuth>
}
export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, //injected in router-provider-wrapper
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 30_000,
});
