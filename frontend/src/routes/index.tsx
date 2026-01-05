// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { roleBasedRedirect } from '@/lib/route-guards';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    await roleBasedRedirect(context);
  },
})

function RouteComponent() {
  return <div>Redirecting...</div>
}
