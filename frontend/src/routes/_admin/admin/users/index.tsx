import { adminGuard } from '@/lib/route-guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/admin/users/')({
  component: RouteComponent,
  beforeLoad: () => adminGuard(),
});

function RouteComponent() {
  return <div>Hello "/(app)/(admin)/users/"!</div>;
}
