import { adminGuard } from '@/lib/route-guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/admin/reports')({
  component: RouteComponent,
  beforeLoad: () => adminGuard(),
});

function RouteComponent() {
  return <div>Hello "/(app)/(admin)/reports"!</div>;
}
