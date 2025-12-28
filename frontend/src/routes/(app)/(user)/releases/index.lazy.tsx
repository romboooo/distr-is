import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(app)/(user)/releases/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(user)/releases/"!</div>
}
