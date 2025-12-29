import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(admin)/users/$userId"!</div>
}
