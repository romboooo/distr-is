import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/admin/reports')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(admin)/reports"!</div>;
}
