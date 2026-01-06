// src/services/api-client.ts
import type { User } from '@/types/api';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const TOKEN_STORAGE_KEY = 'auth_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(token);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(error);
  },
);

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (typeof window === 'undefined') return null;

  try {
    const response = await apiClient.get<User>('/me');
    return response.data;
  } catch (error) {
    console.error('Auth check failed:', error);
    clearAuthToken();
    return null;
  }
};
