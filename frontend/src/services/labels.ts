import { API_BASE_URL } from '@/services/api';

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

export const createLabelProfile = async (
  payload: CreateLabelPayload,
): Promise<LabelResponse> => {
  const response = await fetch(`${API_BASE_URL}/labels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create label profile');
  }

  return response.json();
};
