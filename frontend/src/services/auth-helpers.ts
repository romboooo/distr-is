// src/services/auth-helpers.ts

import { apiClient, clearAuthToken } from '@/services/api';
import { createArtistProfile } from '@/services/artists';
import { createLabelProfile } from '@/services/labels';
import { loginUser } from '@/services/login';
import { registerUser } from '@/services/register';
import type { RegisterFormValues } from '@/services/schemas';
import type { User } from '@/types/api';

type ArtistFormValues = Extract<RegisterFormValues, { type: 'ARTIST' }>;
type LabelFormValues = Extract<RegisterFormValues, { type: 'LABEL' }>;

export async function registerArtist(values: ArtistFormValues) {
  await registerUser({
    login: values.login,
    password: values.password,
    type: 'ARTIST',
  });

  const authResponse = await loginUser({
    login: values.login,
    password: values.password,
  });

  await createArtistProfile({
    name: values.name,
    country: values.country,
    realName: values.realName || null,
    userId: authResponse.user.id,
  });

  return authResponse;
}

export async function registerLabel(values: LabelFormValues) {
  await registerUser({
    login: values.login,
    password: values.password,
    type: 'LABEL',
  });

  const authResponse = await loginUser({
    login: values.login,
    password: values.password,
  });

  await createLabelProfile({
    contactName: values.contactName,
    country: values.country,
    phone: values.phone,
    userId: authResponse.user.id,
  });

  return authResponse;
}

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
