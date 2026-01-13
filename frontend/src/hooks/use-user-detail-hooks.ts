// src/hooks/use-user-detail-hooks.ts
import React from 'react';
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type {
  User,
  UserType,
  Artist,
  LabelData,
  AxiosErrorResponse,
} from '@/types/api';
import { apiClient } from '@/services/api';
import { queryClient } from '@/providers/query-client';

export const useUser = (
  id: number,
  options?: UseQueryOptions<User, AxiosError>,
) => {
  return useQuery<User, AxiosError>({
    queryKey: ['user', id],
    queryFn: () => apiClient.get(`/users/${id}`).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

// Discriminated union types for better type safety
export type UserWithDetails =
  | (User & { type: 'ARTIST'; artistDetails: Artist | null })
  | (User & { type: 'LABEL'; labelDetails: LabelData | null })
  | (User & {
      type: Exclude<UserType, 'ARTIST' | 'LABEL'>;
      artistDetails: null;
      labelDetails: null;
    });

export const useArtistByUserId = (userId: number, enabled: boolean = false) => {
  return useQuery<Artist | null, AxiosError>({
    queryKey: ['artist-by-user-id', userId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<Artist>(`/artists/by-user/${userId}`);
        return res.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null; // Gracefully handle 404
        }
        throw error;
      }
    },
    enabled: enabled && !!userId,
    retry: false,
  });
};

export const useLabelByUserId = (userId: number, enabled: boolean = false) => {
  return useQuery<LabelData | null, AxiosError>({
    queryKey: ['label-by-user-id', userId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<LabelData>(`/labels/by-user/${userId}`);
        return res.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null; // Gracefully handle 404
        }
        throw error;
      }
    },
    enabled: enabled && !!userId,
    retry: false,
  });
};

export const useUserWithDetails = (userId: number) => {
  const userQuery = useUser(userId);
  const isArtist = userQuery.data?.type === 'ARTIST';
  const isLabel = userQuery.data?.type === 'LABEL';

  const artistQuery = useArtistByUserId(userId, !!userQuery.data && isArtist);
  const labelQuery = useLabelByUserId(userId, !!userQuery.data && isLabel);

  const isLoading =
    userQuery.isLoading ||
    (isArtist && artistQuery.isLoading) ||
    (isLabel && labelQuery.isLoading);

  const isError =
    userQuery.isError ||
    (isArtist && artistQuery.isError) ||
    (isLabel && labelQuery.isError);

  const error =
    userQuery.error ||
    (isArtist ? artistQuery.error : undefined) ||
    (isLabel ? labelQuery.error : undefined);

  const combinedData = React.useMemo((): UserWithDetails | null => {
    if (!userQuery.data) return null;

    const baseUser = {
      id: userQuery.data.id,
      login: userQuery.data.login,
      type: userQuery.data.type,
      registrationDate: userQuery.data.registrationDate,
    };

    switch (userQuery.data.type) {
      case 'ARTIST':
        return {
          ...baseUser,
          type: 'ARTIST' as const,
          artistDetails: artistQuery.data,
          labelDetails: null,
        } as UserWithDetails;
      case 'LABEL':
        return {
          ...baseUser,
          type: 'LABEL' as const,
          labelDetails: labelQuery.data,
          artistDetails: null,
        } as UserWithDetails;
      default:
        return {
          ...baseUser,
          type: userQuery.data.type as Exclude<UserType, 'ARTIST' | 'LABEL'>,
          artistDetails: null,
          labelDetails: null,
        } as UserWithDetails;
    }
  }, [userQuery.data, artistQuery.data, labelQuery.data]);

  return {
    data: combinedData,
    isLoading,
    isError,
    error: error as AxiosError | undefined,
    refetch: () => {
      userQuery.refetch();
      if (isArtist) artistQuery.refetch();
      if (isLabel) labelQuery.refetch();
    },
    isRefetching:
      userQuery.isRefetching ||
      artistQuery.isRefetching ||
      labelQuery.isRefetching,
  };
};

export const useDeleteUser = () => {
  return useMutation<void, AxiosErrorResponse, number>({
    mutationFn: (id) => apiClient.delete(`/users/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
};

export const useUpdateUser = () => {
  return useMutation<
    User,
    AxiosErrorResponse,
    {
      id: number;
      login?: string;
      type?: UserType;
    }
  >({
    mutationFn: ({ id, ...data }) =>
      apiClient.patch(`/users/${id}`, data).then((res) => res.data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', updatedUser.id] });
    },
  });
};

// Add this to the bottom of the file
export const useCreateLabel = () => {
  return useMutation<
    LabelData,
    AxiosErrorResponse,
    {
      country: string;
      contactName: string;
      phone: string;
      userId: number;
    }
  >({
    mutationFn: (data) =>
      apiClient.post('/labels', data).then((res) => res.data),
    onSuccess: (newLabel) => {
      queryClient.invalidateQueries({
        queryKey: ['label-by-user-id', newLabel.userId],
      });
      queryClient.invalidateQueries({ queryKey: ['user', newLabel.userId] });
    },
  });
};
