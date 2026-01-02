import { userGuard } from '@/lib/route-guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(user)/royalties/$reportId')({
  component: RouteComponent,
  beforeLoad: () => userGuard(),
});

function RouteComponent() {
  return <div>Hello "/(app)/(user)/royalties/$reportId"!</div>;
}
