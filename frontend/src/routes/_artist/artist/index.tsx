import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_artist/artist/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello artist home</div>;
}
