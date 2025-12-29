import { userGuard } from '@/lib/route-guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(user)/releases/$releaseId/')({
  beforeLoad: () => userGuard(),
});
