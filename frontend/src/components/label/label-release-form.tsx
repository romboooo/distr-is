// src/components/releases/label-release-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useGetArtistsByLabelId } from '@/hooks/use-artists';
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
import { AlertCircle, Loader2, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import type { ReleaseType } from '@/types/api';
import { useGetLabelByUserId } from '@/hooks/use-label-hooks';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const releaseTypeOptions: { label: string; value: ReleaseType }[] = [
  { label: 'Album', value: 'ALBUM' },
  { label: 'Single', value: 'SINGLE' },
  { label: 'Maxi Single', value: 'MAXI_SINGLE' },
  { label: 'EP', value: 'EP' },
  { label: 'Mixtape', value: 'MIXTAPE' },
];

const formSchema = z.object({
  artistId: z.number().min(1, 'Please select an artist'),
  name: z.string().min(2, 'Release name must be at least 2 characters'),
  genre: z.string().min(2, 'Genre must be at least 2 characters'),
  releaseType: z
    .enum(['ALBUM', 'SINGLE', 'MAXI_SINGLE', 'EP', 'MIXTAPE'])
    .refine((val) => !!val, {
      message: 'Please select a release type',
    }),
});

export function LabelReleaseForm() {
  const auth = useAuth();
  const userId = auth.data?.id;
  const navigate = useNavigate();

  const {
    data: labelData,
    isLoading: isLabelLoading,
    isError: isLabelError,
    error: labelError,
  } = useGetLabelByUserId(userId!);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Fixed page size for the dropdown

  const {
    data: artistsData,
    isLoading: isArtistsLoading,
    isError: isArtistsError,
    error: artistsError,
    isFetching,
  } = useGetArtistsByLabelId(labelData?.id, currentPage, pageSize);

  const { mutate: createDraft, isPending } = useCreateReleaseDraft();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistId: undefined,
      name: '',
      genre: '',
      releaseType: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!userId || !labelData) {
      toast.error('Authentication required');
      return;
    }

    if (!artistsData?.totalElements) {
      toast.error('No artists available in your label');
      return;
    }

    createDraft(
      {
        name: values.name,
        artistId: values.artistId,
        genre: values.genre,
        releaseType: values.releaseType,
        labelId: labelData.id,
      },
      {
        onSuccess: (newRelease) => {
          toast.success('Draft release created successfully');
          navigate({
            to: '/label/releases/$releaseId',
            params: { releaseId: newRelease.id.toString() },
          });
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message || 'Failed to create release draft';
          toast.error(errorMessage);
        },
      },
    );
  };

  const isLoading = isLabelLoading || isArtistsLoading;
  const isError = isLabelError || isArtistsError;
  const error = labelError || artistsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || 'Failed to load label information'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!labelData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>No Label Found</AlertTitle>
        <AlertDescription>
          You need to create a label before you can create releases. Please go
          to your dashboard to create a label first.
        </AlertDescription>
        <Button
          onClick={() => navigate({ to: '/label' })}
          variant="outline"
          className="mt-4"
        >
          Go to Dashboard
        </Button>
      </Alert>
    );
  }

  if (!artistsData?.totalElements) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Release</CardTitle>
          <CardDescription>
            You don&apos;t have any artists in your label yet. Add artists first
            before creating releases.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center py-12">
          <Music className="mb-4 w-16 h-16 text-muted-foreground" />
          <p className="mb-6 text-muted-foreground text-lg">
            No artists available in your label
          </p>

        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Release</CardTitle>
        <CardDescription>
          Create a draft release for one of your label&apos;s artists. You can
          add songs and artwork later.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="artistId"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Artist</FormLabel>
                  <div className="relative">
                    {isFetching && currentPage > 0 && (
                      <div className="top-1/2 right-3 absolute -translate-y-1/2 transform">
                        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                      </div>
                    )}
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                      disabled={isArtistsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an artist" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {artistsData?.content.map((artist) => (
                          <SelectItem
                            key={artist.id}
                            value={artist.id.toString()}
                          >
                            {artist.name}
                          </SelectItem>
                        ))}
                        {artistsData && artistsData.totalPages > 1 && (
                          <div className="p-2 border-t">
                            <Pagination className="justify-center">
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                  />
                                </PaginationItem>
                                <PaginationItem>
                                  <span className="px-2 py-1 text-muted-foreground text-sm">
                                    Page {currentPage + 1} of {artistsData.totalPages}
                                  </span>
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(artistsData.totalPages - 1, prev + 1))}
                                    className={currentPage >= artistsData.totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        )}
                        {(!artistsData?.content || artistsData.content.length === 0) && (
                          <div className="p-4 text-muted-foreground text-center">
                            No artists found in your label
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    value={field.value}
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
    </Card>
  );
}
