// src/routes/_artist/artist/releases/$releaseId/edit.tsx
import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { Loader2, AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { queryClient } from '@/providers/query-client';
import { getReleaseById } from '@/services/releases';
import { useGetReleaseById, useUpdateRelease } from '@/hooks/use-release-hooks';
import { UploadCoverButton } from '@/components/releases/upload-cover-button';
import { ReleaseCoverImage } from '@/components/releases/release-cover-image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LabelDisplay } from '@/components/label/label-display';

const releaseSchema = z.object({
  name: z.string().min(1, 'Release name is required'),
  genre: z.string().min(1, 'Genre is required'),
  releaseType: z.enum(['SINGLE', 'ALBUM', 'EP', 'MAXI_SINGLE', 'MIXTAPE']),
  date: z.string().optional(),
});

type ReleaseFormData = z.infer<typeof releaseSchema>;

export const Route = createFileRoute('/_artist/artist/releases/$releaseId/edit/')({
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
  const { mutate: updateReleaseMutation, isPending: isUpdating } = useUpdateRelease();

  const {
    data: release,
    isLoading,
    isError,
    error,
  } = useGetReleaseById(releaseId);

  const form = useForm<ReleaseFormData>({
    resolver: zodResolver(releaseSchema),
    values: {
      name: release?.name || '',
      genre: release?.genre || '',
      releaseType: release?.releaseType as ReleaseFormData['releaseType'] || 'SINGLE',
      date: release?.date ? new Date(release.date).toISOString().split('T')[0] : '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, formState: { errors, isDirty } } = form;

  const onSubmit = (data: ReleaseFormData) => {
    updateReleaseMutation(
      {
        id: releaseId,
        data: {
          name: data.name,
          genre: data.genre,
          releaseType: data.releaseType,
          date: data.date ? new Date(data.date).toISOString() : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Release updated successfully');
          navigate({ to: '/artist/releases/$releaseId', params: { releaseId: releaseId.toString() } });
        },
        onError: (error) => {
          toast.error('Failed to update release', {
            description: error.message || 'Please try again later',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 container">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (isError || !release) {
    return (
      <div className="mx-auto py-8 max-w-2xl container">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to load release details'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Only allow editing for DRAFT releases
  if (release.moderationState !== 'DRAFT') {
    return (
      <div className="mx-auto py-8 max-w-2xl container">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Editing Not Allowed</AlertTitle>
          <AlertDescription>
            Only releases in DRAFT state can be edited. Current state: {release.moderationState}
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate({ to: '/artist/releases/$releaseId', params: { releaseId: releaseId.toString() } })}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Release
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 max-w-4xl container">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/artist/releases/$releaseId', params: { releaseId: releaseId.toString() } })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Release
      </Button>

      <Card>
        <CardHeader className="flex flex-row justify-between items-start pt-4">
          <div>
            <CardTitle className="text-2xl">Edit Release</CardTitle>
            <CardDescription>
              Modify release details. Only draft releases can be edited.
            </CardDescription>
          </div>
          <Badge variant="secondary">DRAFT</Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-start gap-8 px-8">
              <div className="flex flex-col items-center">
                <ReleaseCoverImage
                  releaseId={releaseId}
                  releaseName={release.name}
                  alt={`Cover for ${release.name}`}
                  className="mb-2"
                  width={240}
                  height={240}
                />
                <div className="mt-2">
                  <UploadCoverButton releaseId={releaseId} />
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">Release Name</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Enter release name"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    {...form.register('genre')}
                    placeholder="Enter genre"
                  />
                  {errors.genre && (
                    <p className="text-destructive text-sm">{errors.genre.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="releaseType">Release Type</Label>
                  <Select
                    onValueChange={(value) => form.setValue('releaseType', value as ReleaseFormData['releaseType'])}
                    value={form.watch('releaseType')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select release type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="MAXI_SINGLE">Maxi Single</SelectItem>
                      <SelectItem value="EP">EP</SelectItem>
                      <SelectItem value="ALBUM">Album</SelectItem>
                      <SelectItem value="MIXTAPE">Mixtape</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.releaseType && (
                    <p className="text-destructive text-sm">{errors.releaseType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Release Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register('date')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labelId">Label</Label>
                  <LabelDisplay
                    labelId={release.labelId}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/artist/releases/$releaseId', params: { releaseId: releaseId.toString() } })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty || isUpdating}
            className="gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
