import { useAuth } from "@/hooks/use-auth";
import { router } from "@/providers/router";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtoolsInProd } from '@tanstack/react-router-devtools'

export function RouterProviderWrapper() {
  const auth = useAuth();

  return (
    <>
      <RouterProvider router={router} context={{ auth }} />
      <TanStackRouterDevtoolsInProd router={router} />
    </>
  )
}
