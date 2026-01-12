// src/hooks/use-artist-hooks.ts
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  getAllArtists,
  getArtistById,
  getArtistByUserId,
  getArtistReleases,
} from '@/services/artists';

export const useGetAllArtists = (pageNumber = 0, pageSize = 10) => {
  return useQuery({
    queryKey: ['artists', pageNumber, pageSize],
    queryFn: () => getAllArtists(pageNumber, pageSize),
  });
};

export const useGetArtistById = (artistId?: number) => {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: async () => {
      try {
        return await getArtistById(artistId || 0);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!artistId,
  });
};

export const useGetArtistByUserId = (userId: number) => {
  return useQuery({
    queryKey: ['artist-by-user', userId],
    queryFn: async () => {
      try {
        return await getArtistByUserId(userId);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!userId,
  });
};

export const useGetArtistReleases = (
  artistId: number,
  pageNumber = 0,
  pageSize = 10,
) => {
  return useQuery({
    queryKey: ['artist-releases', artistId, pageNumber, pageSize],
    queryFn: () => getArtistReleases(artistId, pageNumber, pageSize),
    enabled: !!artistId,
  });
};
