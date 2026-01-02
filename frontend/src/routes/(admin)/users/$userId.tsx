import { adminGuard } from '@/lib/route-guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/users/$userId')({
  component: RouteComponent,
  beforeLoad: () => adminGuard(),
});

function RouteComponent() {
  return <div>Hello "/(app)/(admin)/users/$userId"!</div>;
}
