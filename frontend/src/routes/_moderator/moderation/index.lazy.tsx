import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_moderator/moderation/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(moderator)/moderation/"!</div>;
}
