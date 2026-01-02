// src/types/api.ts

export type UserType = 'ARTIST' | 'LABEL' | 'MODERATOR' | 'ADMIN' | 'PLATFORM';

export type ModerationState =
  | 'REJECTED'
  | 'APPROVED'
  | 'WAITING_FOR_CHANGES'
  | 'ON_REVIEW'
  | 'DRAFT';

export type ReleaseType = 'SINGLE' | 'MAXI_SINGLE' | 'EP' | 'ALBUM' | 'MIXTAPE';

export type IsoDateString = string;

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
  artistName: string;
  genre: string;
  releaseUpc: number;
  date: IsoDateString;
  moderationState: ModerationState;
  releaseType: ReleaseType;
  labelId: number;
  labelName: string;
}

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
  metadata: Record<string, string>;
  pathToFile: string;
  songLengthSeconds: number;
}
