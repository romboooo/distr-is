// src/services/artists.ts
import { apiClient } from '@/services/api';
import type { PaginatedResponse, Release } from '@/types/api';
import { AxiosError } from 'axios';

export interface CreateArtistDTO {
  name: string;
  country: string;
  realName?: string;
  userId: number;
}

export interface ArtistReleasesResponse {
  content: Release[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}
export interface ArtistResponse {
  id: number;
  name: string;
  country: string;
  realName?: string | null;
  userId: number;
  userLogin: string;
}

interface ErrorResponse {
  message?: string;
}

export const createArtistProfile = async (
  payload: CreateArtistDTO,
): Promise<ArtistResponse> => {
  try {
    const response = await apiClient.post<ArtistResponse>('/artists', {
      ...payload,
      labelId: 4,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.message || 'Failed to create artist profile');
    }
    throw new Error('Failed to create artist profile');
  }
};

export const createArtist = (data: CreateArtistDTO) =>
  apiClient.post<ArtistResponse>('/artists', data).then((res) => res.data);

export const getAllArtists = (pageNumber: number, pageSize: number) =>
  apiClient
    .get<
      ArtistResponse[]
    >(`/artists?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    .then((res) => res.data);

export const getArtistById = (id: number) =>
  apiClient.get<ArtistResponse>(`/artists/${id}`).then((res) => res.data);

export const getArtistByUserId = (userId: number) =>
  apiClient
    .get<ArtistResponse>(`/artists/by-user/${userId}`)
    .then((res) => res.data);

export const getArtistReleases = async (
  artistId: number,
  page: number = 0,
  size: number = 10,
): Promise<PaginatedResponse<Release>> => {
  const response = await apiClient.get<PaginatedResponse<Release>>(
    `/artists/${artistId}/releases`,
    {
      params: {
        pageNumber: page,
        pageSize: size,
      },
    },
  );
  return response.data;
};
