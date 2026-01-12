// src/hooks/use-user-hooks.ts
import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type {
  AxiosErrorResponse,
  PaginatedResponse,
  User,
  UserType,
} from '@/types/api';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';
import { queryClient } from '@/providers/query-client';

export const useUsers = (
  page = 0,
  size = 20,
  userType?: UserType,
  options?: UseQueryOptions<PaginatedResponse<User>, AxiosError>,
) => {
  return useQuery<PaginatedResponse<User>, AxiosError>({
    queryKey: ['users', { page, size, userType }],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        pageNumber: page,
        pageSize: size,
      };
      if (userType) {
        params.type = userType;
      }

      const response = await apiClient.get('/users', { params });
      return response.data;
    },
    ...options,
  });
};

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

export const useCreateUser = () => {
  return useMutation<
    User,
    AxiosErrorResponse,
    {
      login: string;
      password: string;
      type: UserType;
    }
  >({
    mutationFn: (userData) =>
      apiClient.post('/register', userData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to create user';
      toast.error(errorMessage);
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
      apiClient.put(`/users/${id}`, data).then((res) => res.data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', updatedUser.id] });
      toast.success(`User ${updatedUser.login} updated successfully`);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteUser = () => {
  return useMutation<void, AxiosErrorResponse, number>({
    mutationFn: (id) => apiClient.delete(`/users/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id], exact: true });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
    },
  });
};

export const useCurrentUser = (options?: UseQueryOptions<User, AxiosError>) => {
  return useQuery<User, AxiosError>({
    queryKey: ['current-user'],
    queryFn: () => apiClient.get('/me').then((res) => res.data),
    ...options,
  });
};
