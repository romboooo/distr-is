import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_label/label/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(user)/profile"!</div>;
}
