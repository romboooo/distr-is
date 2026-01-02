// src/services/register.ts
import { apiClient } from '@/services/api';
import { AxiosError } from 'axios';

export interface RegisterUserPayload {
  login: string;
  password: string;
  type: 'ARTIST' | 'LABEL' | 'MODERATOR' | 'ADMIN' | 'PLATFORM';
}

export interface UserResponse {
  id: number;
  login: string;
  type: string;
  registrationDate: string;
}

export interface ErrorResponse {
  message?: string;
}

export const registerUser = async (
  payload: RegisterUserPayload,
): Promise<UserResponse> => {
  try {
    const response = await apiClient.post<UserResponse>('/register', payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};
