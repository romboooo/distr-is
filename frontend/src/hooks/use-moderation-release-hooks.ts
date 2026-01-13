import { queryClient } from '@/providers/query-client';
import { apiClient } from '@/services/api';
import type {
  PaginatedResponse,
  Release,
  AxiosErrorResponse,
  ModerationState,
  ModerationRecord,
} from '@/types/api';
import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export const usePendingReleases = (
  page = 0,
  size = 10,
  options?: UseQueryOptions<PaginatedResponse<Release>, AxiosError>,
) => {
  return useQuery<PaginatedResponse<Release>, AxiosError>({
    queryKey: ['pending-releases', { page, size }],
    queryFn: async () => {
      const params = {
        pageNumber: page,
        pageSize: size,
      };

      const response = await apiClient.get('/moderation/pending', { params });
      return response.data;
    },
    ...options,
  });
};

export const useModerateRelease = () => {
  return useMutation<
    ModerationRecord,
    AxiosErrorResponse,
    {
      moderatorId: number;
      releaseId: number;
      comment: string;
      moderationState: ModerationState;
    }
  >({
    mutationFn: (data) =>
      apiClient.post('/moderation', data).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pending-releases'] });

      toast.success(`Release "${data.releaseName}" moderated successfully`, {
        description: `Status changed to ${data.moderationState}`,
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to moderate release';
      toast.error(errorMessage);
    },
  });
};

export const useRelease = (
  id: number,
  options?: UseQueryOptions<Release, AxiosError>,
) => {
  return useQuery<Release, AxiosError>({
    queryKey: ['release', id],
    queryFn: () => apiClient.get(`/releases/${id}`).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

export const useModerationHistory = (
  releaseId: number,
  options?: UseQueryOptions<ModerationRecord[], AxiosError>,
) => {
  return useQuery<ModerationRecord[], AxiosError>({
    queryKey: ['moderation-history', releaseId],
    queryFn: () =>
      apiClient.get(`/moderation/history/${releaseId}`).then((res) => res.data),
    enabled: !!releaseId,
    ...options,
  });
};

// New hook for requesting moderation of a release
export const useRequestModeration = () => {
  return useMutation<Release, AxiosErrorResponse, { releaseId: number }>({
    mutationFn: ({ releaseId }) =>
      apiClient
        .post(`/releases/${releaseId}/request-moderation`)
        .then((res) => res.data),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['pending-releases'] });
      queryClient.invalidateQueries({ queryKey: ['release', data.id] });

      toast.success(`Release "${data.name}" submitted for moderation`, {
        description: `Status changed to ${data.moderationState}`,
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to submit release for moderation';
      toast.error(errorMessage);
    },
  });
};

export const useGetModeratorIdByUserId = (
  userId: number | null | undefined,
  options?: UseQueryOptions<number, AxiosError>,
) => {
  return useQuery<number, AxiosError>({
    queryKey: ['moderator-id-by-user-id', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await apiClient.get(
        `/moderation/moderator-id-by-user-id/${userId}`,
      );
      return response.data;
    },
    enabled: !!userId,
    ...options,
  });
};
