// src/types/api.ts
import type { ErrorResponse } from '@/types/auth';
import type { AxiosError } from 'axios';

export type UserType = 'ARTIST' | 'LABEL' | 'MODERATOR' | 'ADMIN' | 'PLATFORM';
export type ModerationState =
  | 'REJECTED'
  | 'APPROVED'
  | 'WAITING_FOR_CHANGES'
  | 'ON_REVIEW'
  | 'DRAFT';
export type ReleaseType = 'SINGLE' | 'MAXI_SINGLE' | 'EP' | 'ALBUM' | 'MIXTAPE';
export type IsoDateString = string;
export type AxiosErrorResponse = AxiosError<ErrorResponse>;

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export interface User {
  id: number;
  login: string;
  type: UserType;
  registrationDate: IsoDateString;
}

export interface Label {
  id: number;
  country: string;
  contactName: string;
  phone: string;
  email: string;
  userId: number;
  userLogin: string;
}

export interface Artist {
  id: number;
  name: string;
  labelId: number;
  country: string;
  realName: string;
  userId: number;
  userLogin: string;
}

export interface Release {
  id: number;
  name: string;
  artistId: number;
  genre: string;
  releaseUpc: number | null;
  date: IsoDateString;
  moderationState: ModerationState;
  releaseType: ReleaseType;
  labelId: number;
  coverPath: string | null;
}

// Extended types with relationships
export interface ReleaseWithDetails extends Release {
  artist?: Artist;
  label?: Label;
  songs: SongWithDetails[];
}

export interface Song {
  id: number;
  releaseId: number;
  title: string;
  musicAuthor: string;
  parentalAdvisory: boolean;
  streams: number;
  songUpc: number;
  isrc: string;
  songLengthSeconds: number;
  moderationState: ModerationState;
  metadata: Record<string, string>;
  pathToFile: string;
}

export interface SongWithDetails extends Song {
  artists: Artist[];
}

export type CreateReleaseDraftDTO = {
  name: string;
  artistId: number;
  genre: string;
  releaseType: ReleaseType;
  labelId: number;
};

export type AddSongToReleaseDTO = {
  title: string;
  artistIds: number[];
  musicAuthor: string;
  parentalAdvisory: boolean;
  isrc: string;
  songUpc: number;
  metadata: Record<string, string>;
};

export interface UpdateReleaseDTO {
  name?: string;
  genre?: string;
  releaseType?: 'SINGLE' | 'MAXI_SINGLE' | 'EP' | 'ALBUM' | 'MIXTAPE';
  date?: string | null;
}
