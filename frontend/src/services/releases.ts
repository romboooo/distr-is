// src/services/releases.ts
import { apiClient } from '@/services/api';
import type {
  ReleaseWithDetails,
  CreateReleaseDraftDTO,
  SongWithDetails,
  AddSongToReleaseDTO,
  Release,
  Song,
  UpdateReleaseDTO,
  PaginatedResponse,
  Royalty,
} from '@/types/api';

export async function getReleaseById(id: number): Promise<Release> {
  const response = await apiClient.get<Release>(`/releases/${id}`);
  return response.data;
}

export async function createReleaseDraft(
  data: CreateReleaseDraftDTO,
): Promise<ReleaseWithDetails> {
  const response = await apiClient.post<ReleaseWithDetails>(
    '/releases/draft',
    data,
  );
  return response.data;
}

export async function addSongToRelease(
  releaseId: number,
  data: AddSongToReleaseDTO,
): Promise<SongWithDetails> {
  const response = await apiClient.post<SongWithDetails>(
    `/releases/${releaseId}/songs`,
    data,
  );
  return response.data;
}

export async function uploadReleaseCover(
  releaseId: number,
  file: File,
): Promise<{ path: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<{ path: string }>(
    `/releases/${releaseId}/cover`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}

export async function requestReleaseModeration(
  releaseId: number,
): Promise<ReleaseWithDetails> {
  const response = await apiClient.post<ReleaseWithDetails>(
    `/releases/${releaseId}/request-moderation`,
  );
  return response.data;
}

export const getReleaseSongs = async (releaseId: number): Promise<Song[]> => {
  const response = await apiClient.get<Song[]>(`/releases/${releaseId}/songs`);
  return response.data;
};

export async function getReleaseCover(releaseId: number): Promise<Blob> {
  const response = await apiClient.get<Blob>(`/releases/${releaseId}/cover`, {
    responseType: 'blob',
  });
  return response.data;
}

export const updateRelease = async (id: number, data: UpdateReleaseDTO) => {
  const response = await apiClient.patch<Release>(`/releases/${id}`, data);
  return response.data;
};

export const getReleaseRoyalties = async (
  releaseId: number,
  page: number = 0,
  size: number = 10,
): Promise<PaginatedResponse<Royalty>> => {
  const { data } = await apiClient.get<PaginatedResponse<Royalty>>(
    `/releases/${releaseId}/royalties`,
    {
      params: {
        pageNumber: page,
        pageSize: size,
      },
    },
  );
  return data;
};
