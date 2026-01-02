import type { IsoDateString } from '@/types/api';

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  user: {
    id: number;
    login: string;
    type: string;
    registrationDate: IsoDateString;
  };
}

export interface ErrorResponse {
  message?: string;
}
