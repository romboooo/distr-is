import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/admin/users/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(admin)/users/"!</div>;
}
