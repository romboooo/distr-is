import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(admin)/platforms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(admin)/platforms"!</div>
}
