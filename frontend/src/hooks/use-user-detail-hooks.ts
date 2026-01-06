// src/hooks/use-user-detail-hooks.ts
import React from 'react';
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { User, UserType, Artist, Label } from '@/types/api';
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

export interface UserWithArtistDetails extends User {
  type: 'ARTIST';
  artistDetails: Artist | null;
}

export interface UserWithLabelDetails extends User {
  type: 'LABEL';
  labelDetails: Label | null;
}

export interface UserWithDetails extends User {
  artistDetails: Artist | null;
  labelDetails: Label | null;
}

export const useArtistByUserId = (userId: number, enabled: boolean = false) => {
  return useQuery<Artist, AxiosError>({
    queryKey: ['artist-by-user-id', userId],
    queryFn: () => apiClient.get(`/artists/${userId}`).then((res) => res.data),
    enabled: enabled && !!userId,
    retry: false,
  });
};

export const useLabelByUserId = (userId: number, enabled: boolean = false) => {
  return useQuery<Label, AxiosError>({
    queryKey: ['label-by-user-id', userId],
    queryFn: () =>
      apiClient.get(`/labels/user/${userId}`).then((res) => res.data),
    enabled: enabled && !!userId,
    retry: false,
  });
};

export const useUserWithDetails = (userId: number) => {
  const userQuery = useUser(userId);

  const artistQuery = useArtistByUserId(
    userId,
    !!userQuery.data && userQuery.data.type === 'ARTIST',
  );

  const labelQuery = useLabelByUserId(
    userId,
    !!userQuery.data && userQuery.data.type === 'LABEL',
  );

  const isLoading =
    userQuery.isLoading ||
    (userQuery.data?.type === 'ARTIST' && artistQuery.isLoading) ||
    (userQuery.data?.type === 'LABEL' && labelQuery.isLoading);

  const isError =
    userQuery.isError || artistQuery.isError || labelQuery.isError;
  const error = userQuery.error || artistQuery.error || labelQuery.error;

  const combinedData = React.useMemo(() => {
    if (!userQuery.data) return null;

    const baseUserData = {
      ...userQuery.data,
      artistDetails: null,
      labelDetails: null,
    };

    if (userQuery.data.type === 'ARTIST' && artistQuery.data) {
      return {
        ...baseUserData,
        type: 'ARTIST' as const,
        artistDetails: artistQuery.data,
      };
    }

    if (userQuery.data.type === 'LABEL' && labelQuery.data) {
      return {
        ...baseUserData,
        type: 'LABEL' as const,
        labelDetails: labelQuery.data,
      };
    }

    return baseUserData;
  }, [userQuery.data, artistQuery.data, labelQuery.data]);

  return {
    data: combinedData as UserWithDetails | null,
    isLoading,
    isError,
    error,
    refetch: () => {
      userQuery.refetch();
      if (userQuery.data?.type === 'ARTIST') {
        artistQuery.refetch();
      }
      if (userQuery.data?.type === 'LABEL') {
        labelQuery.refetch();
      }
    },
    isRefetching:
      userQuery.isRefetching ||
      artistQuery.isRefetching ||
      labelQuery.isRefetching,
  };
};

export const useDeleteUser = () => {
  return useMutation<
    void,
    AxiosError<{ error: string; message: string }>,
    number
  >({
    mutationFn: (id) => apiClient.delete(`/users/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id], exact: true });
    },
  });
};

export const useUpdateUser = () => {
  return useMutation<
    User,
    AxiosError<{ error: string; message: string }>,
    {
      id: number;
      login?: string;
      type?: UserType;
    }
  >({
    mutationFn: ({ id, ...data }) =>
      apiClient.put(`/users/${id}`, data).then((res) => res.data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', updatedUser.id] });
    },
  });
};
