import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useUserWithDetails } from '@/hooks/use-user-detail-hooks';
import { useCreateReleaseDraft } from '@/hooks/use-release-hooks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import type { ReleaseType } from '@/types/api';
import { LabelDisplay } from '@/components/label/label-display';

const releaseTypeOptions: { label: string; value: ReleaseType }[] = [
  { label: 'Album', value: 'ALBUM' },
  { label: 'Single', value: 'SINGLE' },
  { label: 'Maxi Single', value: 'MAXI_SINGLE' },
  { label: 'EP', value: 'EP' },
  { label: 'Mixtape', value: 'MIXTAPE' },
];

const formSchema = z.object({
  name: z.string().min(2, 'Release name must be at least 2 characters'),
  genre: z.string().min(2, 'Genre must be at least 2 characters'),
  releaseType: z.enum(['ALBUM', 'SINGLE', 'MAXI_SINGLE', 'EP', 'MIXTAPE']).refine((val) => !!val, {
    message: 'Please select a release type',
  }),
});

export function ReleaseForm() {
  const auth = useAuth();
  const userId = auth.data?.id;
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useUserWithDetails(userId!);

  const { mutate: createDraft, isPending } = useCreateReleaseDraft();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      genre: '',
      releaseType: undefined,
    },
  });

  const labelMissing = userData?.type === 'ARTIST' && !userData.artistDetails?.labelId;
  const labelId = userData?.type === 'ARTIST' ? userData.artistDetails?.labelId : undefined;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!userId || !userData) {
      toast.error('Authentication required');
      return;
    }

    if (labelMissing) {
      toast.error('You need to create a label before creating a release');
      return;
    }

    if (userData.type !== 'ARTIST' || !userData.artistDetails?.labelId) {
      toast.error('Invalid user type or missing label');
      return;
    }

    createDraft(
      {
        name: values.name,
        artistId: userData.artistDetails.id,
        genre: values.genre,
        releaseType: values.releaseType,
        labelId: userData.artistDetails.labelId,
      },
      {
        onSuccess: (newRelease) => {
          toast.success('Draft release created successfully');
          navigate({
            to: '/artist/releases/$releaseId',
            params: { releaseId: newRelease.id.toString() }
          });
        },
        onError: (error) => {
          const errorMessage = error.response?.data?.message || 'Failed to create release draft';
          toast.error(errorMessage);
        },
      }
    );
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (isUserError || !userData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {userError?.message || 'Failed to load user information'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Release</CardTitle>
        <CardDescription>
          Create a draft release. You can add songs and artwork later.
        </CardDescription>
      </CardHeader>

      {labelMissing ? (
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Label Required</AlertTitle>
            <AlertDescription>
              You need to create a label before you can create releases.
              Please go to your dashboard to create a label first.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate({ to: '/artist' })} variant="outline">
            Go to Dashboard
          </Button>
        </CardContent>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter release name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter genre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select release type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {releaseTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {labelId && <div className="space-y-2">
                <FormLabel>Associated Label</FormLabel>
                <LabelDisplay labelId={labelId} />
              </div>}
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Draft'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      )}
    </Card>
  );
}
