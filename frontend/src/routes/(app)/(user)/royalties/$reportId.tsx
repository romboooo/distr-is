import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(user)/royalties/$reportId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(user)/royalties/$reportId"!</div>
}
