// src/services/labels.ts
import { apiClient } from '@/services/api';
import { AxiosError } from 'axios';

export interface CreateLabelPayload {
  contactName: string;
  country: string;
  phone: string;
  userId: number;
}

export interface LabelResponse {
  id: number;
  country: string;
  contactName: string;
  phone: string;
  userId: number;
  userLogin: string;
}

interface ErrorResponse {
  message?: string;
}

export const createLabelProfile = async (
  payload: CreateLabelPayload,
): Promise<LabelResponse> => {
  try {
    const response = await apiClient.post<LabelResponse>('/labels', payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.message || 'Failed to create label profile');
    }
    throw new Error('Failed to create label profile');
  }
};
