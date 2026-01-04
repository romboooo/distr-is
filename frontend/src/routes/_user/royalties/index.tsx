import { userGuard } from '@/lib/route-guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_user/royalties/')({
  component: RouteComponent,
  beforeLoad: () => userGuard(),
});

function RouteComponent() {
  return <div>Hello "/(app)/(user)/royalties/"!</div>;
}
