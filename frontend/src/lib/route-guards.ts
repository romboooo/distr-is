// src/lib/route-guards.ts
import { redirect } from '@tanstack/react-router';
import type { UserType } from '@/types/api';

// Базовая функция защиты
const baseGuard = async (allowedRoles: UserType[]) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (!token) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.pathname + location.search,
      },
    });
  }

  // Маппинг токенов к ID пользователей
  const tokenMap: Record<string, number> = {
    artist_token: 1,
    label_token: 2,
    moderator_token: 3,
    admin_token: 4,
    artist2_token: 5,
  };

  const userId = tokenMap[token];

  if (!userId) {
    localStorage.removeItem('auth_token');
    throw redirect({
      to: '/login',
      search: {
        redirect: location.pathname + location.search,
        error: 'INVALID_TOKEN',
      },
    });
  }

  // Получаем пользователя из мок-базы
  const mockUsers: { id: number; type: UserType }[] = [
    { id: 1, type: 'ARTIST' },
    { id: 2, type: 'LABEL' },
    { id: 3, type: 'MODERATOR' },
    { id: 4, type: 'ADMIN' },
    { id: 5, type: 'ARTIST' },
  ];

  const user = mockUsers.find((u) => u.id === userId);

  if (!user || !allowedRoles.includes(user.type)) {
    throw redirect({
      to: '/unauthorized',
      search: {
        attempted: location.pathname,
      },
    });
  }

  return user;
};

export const artistGuard = () => baseGuard(['ARTIST']);
export const labelGuard = () => baseGuard(['LABEL']);
export const moderatorGuard = () => baseGuard(['MODERATOR', 'ADMIN']);
export const adminGuard = () => baseGuard(['ADMIN']);
export const userGuard = () => baseGuard(['ARTIST', 'LABEL']);
export const anyGuard = () =>
  baseGuard(['ARTIST', 'LABEL', 'MODERATOR', 'ADMIN', 'PLATFORM']);
