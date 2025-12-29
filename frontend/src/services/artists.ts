// src/services/artists.ts
import { API_BASE_URL } from '@/services/api';

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

export const createArtistProfile = async (
  payload: CreateArtistPayload,
): Promise<ArtistResponse> => {
  const response = await fetch(`${API_BASE_URL}/artists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create artist profile');
  }

  return response.json();
};
