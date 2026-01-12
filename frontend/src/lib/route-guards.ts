// src/lib/route-guards.ts
import { redirect } from '@tanstack/react-router';
import type { UserType } from '@/types/api';
import { clearAuthToken, getAuthToken } from '@/services/api';
import type { RouterContext } from '@/providers/router';

const baseGuard = async (allowedRoles: UserType[], context: RouterContext) => {
  const { auth } = context;
  if (auth.isLoading) {
    return undefined;
  }

  if (!auth.isAuthenticated || !auth.data) {
    await notLoggedRedirect();
    return;
  }

  if (!allowedRoles.includes(auth.data.type)) {
    throw redirect({
      to: '/unauthorized',
      search: { attempted: window.location.pathname },
    });
  }

  return auth.data;
};

export const artistGuard = (context: RouterContext) =>
  baseGuard(['ARTIST'], context);
export const labelGuard = (context: RouterContext) =>
  baseGuard(['LABEL'], context);
export const moderatorGuard = (context: RouterContext) =>
  baseGuard(['MODERATOR', 'ADMIN'], context);
export const adminGuard = (context: RouterContext) =>
  baseGuard(['ADMIN'], context);
export const userGuard = (context: RouterContext) =>
  baseGuard(['ARTIST', 'LABEL', 'ADMIN'], context);
export const anyGuard = (context: RouterContext) =>
  baseGuard(['ARTIST', 'LABEL', 'MODERATOR', 'ADMIN', 'PLATFORM'], context);

export const roleBasedRedirect = async (context: RouterContext) => {
  const { auth } = context;

  if (!auth.isAuthenticated || !auth.data) {
    await notLoggedRedirect();
    return;
  }

  switch (auth.data.type) {
    case 'ARTIST':
      throw redirect({ to: '/artist' });
    case 'LABEL':
      throw redirect({ to: '/label' });
    case 'MODERATOR':
      throw redirect({ to: '/moderation' });
    case 'ADMIN':
      throw redirect({ to: '/admin' });
    case 'PLATFORM':
    default:
      throw redirect({
        to: '/unauthorized',
        search: { attempted: window.location.pathname },
      });
  }
};

export const notLoggedRedirect = async () => {
  const token = getAuthToken();
  if (!token) {
    throw redirect({
      to: '/login',
      search: { next: window.location.pathname + window.location.search },
    });
  }

  clearAuthToken();
  throw redirect({
    to: '/login',
    search: {
      next: window.location.pathname + window.location.search,
      error: 'INVALID_SESSION',
    },
  });
};
