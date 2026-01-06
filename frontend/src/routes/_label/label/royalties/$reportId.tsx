import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_label/label/royalties/$reportId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(user)/royalties/$reportId"!</div>;
}
