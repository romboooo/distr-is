import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(moderator)/moderation/')({
  component: RouteComponent,

})

function RouteComponent() {
  return <div>Hello "/(app)/(moderator)/moderation/"!</div>
}
