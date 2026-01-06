import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_artist/artist/releases/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(user)/releases/"!</div>;
}
