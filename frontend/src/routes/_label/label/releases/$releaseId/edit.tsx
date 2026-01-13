import { ReleaseEditContent } from '@/components/releases/release-edit-content';
import { queryClient } from '@/providers/query-client';
import { getReleaseById } from '@/services/releases';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_label/label/releases/$releaseId/edit')({
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
      to: '/label/releases/$releaseId',
      params: { releaseId: releaseId.toString() },
    });
  };

  const handleSuccess = () => {
    navigate({
      to: '/label/releases/$releaseId',
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
