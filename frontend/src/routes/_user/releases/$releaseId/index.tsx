import { userGuard } from '@/lib/route-guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_user/releases/$releaseId/')({
  beforeLoad: () => userGuard(),
});
