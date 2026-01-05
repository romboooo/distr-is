import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_label/label/releases/$releaseId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(user)/releases/$releaseId/"!</div>;
}
