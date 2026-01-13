import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(songLengthSeconds: number) {
  return `${Math.floor(songLengthSeconds / 60)}:${(songLengthSeconds % 60).toString().padStart(2, '0')}`;
}
