import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createReleaseDraft,
  addSongToRelease,
  uploadSongFile,
  uploadReleaseCover,
  requestReleaseModeration,
  getReleaseById,
  getReleaseSongs,
  getReleaseCover,
  updateRelease,
} from '@/services/releases';
import type {
  Release,
  CreateReleaseDraftDTO,
  Song,
  AddSongToReleaseDTO,
  AxiosErrorResponse,
  PaginatedResponse,
  UpdateReleaseDTO,
} from '@/types/api';
import { queryClient } from '@/providers/query-client';
import { getArtistReleases } from '@/services/artists';

export function useGetReleaseById(releaseId: number) {
  return useQuery({
    queryKey: ['release', releaseId],
    queryFn: () => getReleaseById(releaseId),
    enabled: !!releaseId,
  });
}

export const useCreateReleaseDraft = () => {
  return useMutation<Release, AxiosErrorResponse, CreateReleaseDraftDTO>({
    mutationFn: createReleaseDraft,
    onSuccess: (newRelease) => {
      queryClient.invalidateQueries({ queryKey: ['artist-releases'] });
      queryClient.setQueryData(['release', newRelease.id], newRelease);
    },
  });
};

export const useAddSongToRelease = (releaseId: number) => {
  return useMutation<Song, AxiosErrorResponse, AddSongToReleaseDTO>({
    mutationFn: (data) => addSongToRelease(releaseId, data),
    onSuccess: (newSong) => {
      queryClient.invalidateQueries({ queryKey: ['release-songs', releaseId] });
      queryClient.setQueryData(['song', newSong.id], newSong);
    },
  });
};

export const useUploadSongFile = () => {
  return useMutation<
    { path: string },
    AxiosErrorResponse,
    { songId: number; file: File }
  >({
    mutationFn: ({ songId, file }) => uploadSongFile(songId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['song', variables.songId] });
    },
  });
};

export const useUploadReleaseCover = () => {
  return useMutation<
    { path: string },
    AxiosErrorResponse,
    { releaseId: number; file: File }
  >({
    mutationFn: ({ releaseId, file }) => uploadReleaseCover(releaseId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['release', variables.releaseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['release-cover', variables.releaseId],
      });
    },
  });
};
export const useRequestReleaseModeration = () => {
  return useMutation<Release, AxiosErrorResponse, number>({
    mutationFn: requestReleaseModeration,
    onSuccess: (updatedRelease) => {
      queryClient.invalidateQueries({ queryKey: ['artist-releases'] });
      queryClient.setQueryData(['release', updatedRelease.id], updatedRelease);
    },
  });
};

export function useGetReleaseSongs(releaseId: number) {
  return useQuery<Song[], AxiosErrorResponse>({
    queryKey: ['release-songs', releaseId],
    queryFn: () => getReleaseSongs(releaseId),
    enabled: !!releaseId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 1,
  });
}

export function useGetReleasesByArtistId(
  artistId: number,
  page: number = 0,
  size: number = 10,
) {
  return useQuery<PaginatedResponse<Release>, AxiosErrorResponse>({
    queryKey: ['artist-releases', artistId, page, size],
    queryFn: () => getArtistReleases(artistId, page, size),
    enabled: !!artistId,
    staleTime: 3 * 60 * 1000, // 3 minutes cache
    retry: 1,
  });
}

export function useGetReleaseCover(releaseId: number) {
  return useQuery<string, AxiosErrorResponse>({
    queryKey: ['release-cover', releaseId],
    queryFn: async () => URL.createObjectURL(await getReleaseCover(releaseId)),
    enabled: !!releaseId,
    staleTime: 60 * 60 * 1000, // 1 hour cache since cover images rarely change
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateRelease() {
  return useMutation<
    Release,
    AxiosErrorResponse,
    { id: number; data: UpdateReleaseDTO }
  >({
    mutationFn: ({ id, data }) => updateRelease(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['release', id] });
      queryClient.invalidateQueries({ queryKey: ['artist-releases'] });
      queryClient.invalidateQueries({ queryKey: ['releases'] });

      // Optional: Invalidate release songs if metadata might affect them
      queryClient.invalidateQueries({ queryKey: ['release-songs', id] });
    },
    onError: (error) => {
      console.error('Failed to update release:', error);
      // Convert to standardized error format if needed
      throw error;
    },
  });
}
