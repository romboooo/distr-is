import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/admin/platforms')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(admin)/platforms"!</div>;
}
