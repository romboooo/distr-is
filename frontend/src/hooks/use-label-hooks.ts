// src/hooks/use-label-hooks.ts
import { apiClient } from '@/services/api';
import type { LabelData } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useGetLabelById(labelId?: number) {
  return useQuery({
    queryKey: ['label', labelId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<LabelData>(`/labels/${labelId}`);
        return res.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null; // Gracefully handle 404
        }
        throw error;
      }
    },
    enabled: !!labelId,
  });
}

export function useGetLabelByUserId(userId?: number) {
  return useQuery<LabelData | null, AxiosError>({
    queryKey: ['label-by-user', userId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<LabelData>(`/labels/by-user/${userId}`);
        return res.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null; // Gracefully handle 404 Not Found
        }
        throw error;
      }
    },
    enabled: !!userId, // Only run query when userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 1, // Retry failed requests once
  });
}
