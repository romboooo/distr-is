// src/routes/_artist/artist/releases/$releaseId/edit.tsx
import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { queryClient } from '@/providers/query-client';
import { getReleaseById } from '@/services/releases';
import { ReleaseEditContent } from '@/components/releases/release-edit-content';

export const Route = createFileRoute(
  '/_artist/artist/releases/$releaseId/edit/',
)({
  component: ReleaseEditPage,
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

function ReleaseEditPage() {
  const { releaseId } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate({
      to: '/artist/releases/$releaseId',
      params: { releaseId: releaseId.toString() },
    });
  };

  const handleSuccess = () => {
    navigate({
      to: '/artist/releases/$releaseId',
      params: { releaseId: releaseId.toString() },
    });
  };

  return (
    <ReleaseEditContent
      releaseId={releaseId}
      onCancel={handleCancel}
      onSuccess={handleSuccess}
    />
  );
}
