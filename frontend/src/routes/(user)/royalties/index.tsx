import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(user)/royalties/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(user)/royalties/"!</div>
}
