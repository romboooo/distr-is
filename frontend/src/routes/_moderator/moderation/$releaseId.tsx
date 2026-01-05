import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_moderator/moderation/$releaseId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(moderator)/moderation/$releaseId"!</div>;
}
