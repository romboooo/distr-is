// src/types/api.ts
import type { ErrorResponse } from '@/types/auth';
import type { AxiosError } from 'axios';

export type UserType = 'ARTIST' | 'LABEL' | 'MODERATOR' | 'ADMIN' | 'PLATFORM';

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

export interface LabelData {
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

export interface ReleaseWithDetails extends Release {
  artist?: Artist;
  label?: LabelData;
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
  songLengthSeconds: number;
  metadata: string;
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
  releaseId: number;
  title: string;
  artistIds: number[];
  musicAuthor: string;
  parentalAdvisory: boolean;
  metaData: string;
};

export interface UpdateReleaseDTO {
  name?: string;
  genre?: string;
  releaseType?: 'SINGLE' | 'MAXI_SINGLE' | 'EP' | 'ALBUM' | 'MIXTAPE';
  date?: string | null;
}
export type ModerationState =
  | 'DRAFT'
  | 'ON_REVIEW'
  | 'ON_MODERATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'WAITING_FOR_CHANGES';

export interface Song {
  id: number;
  releaseId: number;
  releaseName: string;
  artistIds: number[];
  artistNames: string[];
  musicAuthor: string;
  parentalAdvisory: boolean;
  streams: number;
  songUpc: number;
  metadata: string;
  pathToFile: string;
  songLengthSeconds: number;
  title: string;
}

export interface ModerationRecord {
  id: number;
  comment: string;
  moderatorId: number;
  moderatorName: string;
  releaseId: number;
  releaseName: string;
  date: string;
  moderationState: ModerationState;
}

export type Royalty = {
  royaltyId: number;
  amount: number;
  songId: number;
  songTitle: string;
  platformId: number;
  platformName: string;
};
