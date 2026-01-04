// src/lib/route-guards.ts
import { redirect } from '@tanstack/react-router';
import type { UserType } from '@/types/api';
import { clearAuthToken, getAuthToken } from '@/services/api';
import { getCurrentUser } from '@/services/auth-helpers';

const baseGuard = async (allowedRoles: UserType[]) => {
  if (typeof window === 'undefined') return null;

  const token = getAuthToken();
  if (!token) {
    throw redirect({
      to: '/login',
      search: { next: window.location.pathname + window.location.search },
    });
  }

  const user = await getCurrentUser();

  if (!user) {
    clearAuthToken();
    throw redirect({
      to: '/login',
      search: {
        next: window.location.pathname + window.location.search,
        error: 'INVALID_SESSION',
      },
    });
  }

  if (!allowedRoles.includes(user.type)) {
    throw redirect({
      to: '/unauthorized',
      search: { attempted: window.location.pathname },
    });
  }

  return user;
};

// Export guards with real API checks
export const artistGuard = () => baseGuard(['ARTIST']);
export const labelGuard = () => baseGuard(['LABEL']);
export const moderatorGuard = () => baseGuard(['MODERATOR', 'ADMIN']);
export const adminGuard = () => baseGuard(['ADMIN']);
export const userGuard = () => baseGuard(['ARTIST', 'LABEL', 'ADMIN']);
export const anyGuard = () =>
  baseGuard(['ARTIST', 'LABEL', 'MODERATOR', 'ADMIN', 'PLATFORM']);
