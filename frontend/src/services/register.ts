// src/services/register.ts
import { API_BASE_URL } from '@/services/api';

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

export const registerUser = async (
  payload: RegisterUserPayload,
): Promise<UserResponse> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
};
