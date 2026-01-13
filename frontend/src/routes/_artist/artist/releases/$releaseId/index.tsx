// src/routes/_artist/artist/releases/$releaseId.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { queryClient } from '@/providers/query-client';
import { getReleaseById } from '@/services/releases';
import { ReleaseDetailContent } from '@/components/releases/release-detail-content';

export const Route = createFileRoute('/_artist/artist/releases/$releaseId/')({
  component: ReleaseDetailPage,
  loader: async ({ params }) => {
    const { releaseId } = params;
    const id = parseInt(releaseId);

    if (isNaN(id) || id <= 0) {
      throw new Error('Invalid release ID');
    }

    await queryClient.ensureQueryData({
      queryKey: ['release', id],
      queryFn: () => getReleaseById(id),
    });

    return {
      releaseId: id,
    };
  },
});

function ReleaseDetailPage() {
  const { releaseId } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <ReleaseDetailContent
      onBack={() => navigate({ to: "/artist/releases" })}
      onEdit={() => navigate({ to: "/artist/releases/$releaseId/edit", params: { releaseId: releaseId.toString() } })}
      releaseId={releaseId}
    />
  );
}
