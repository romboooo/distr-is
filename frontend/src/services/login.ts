// src/services/login.ts
import { apiClient, TOKEN_STORAGE_KEY } from '@/services/api';
import type { ErrorResponse, LoginPayload, LoginResponse } from '@/types/auth';
import { AxiosError } from 'axios';

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/login', payload);

    localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};
