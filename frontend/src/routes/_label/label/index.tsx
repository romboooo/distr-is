import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_label/label/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello label home</div>;
}
