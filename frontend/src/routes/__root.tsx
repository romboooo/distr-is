// src/routes/__root.tsx (updated)
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { RouterContext } from '@/providers/router';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
