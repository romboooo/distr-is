import { moderatorGuard } from '@/lib/route-guards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(moderator)/moderation/$releaseId',
)({
  beforeLoad: () => moderatorGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(moderator)/moderation/$releaseId"!</div>
}
