// src/services/artists.ts
import { apiClient } from '@/services/api';
import { AxiosError } from 'axios';

export interface CreateArtistPayload {
  name: string;
  country: string;
  realName?: string | null;
  userId: number;
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
  payload: CreateArtistPayload,
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
