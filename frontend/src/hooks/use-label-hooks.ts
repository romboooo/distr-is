// src/hooks/use-label-hooks.ts
import { apiClient } from '@/services/api';
import type { Label } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useGetLabelById(labelId?: number) {
  return useQuery({
    queryKey: ['label', labelId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<Label>(`/labels/${labelId}`);
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
