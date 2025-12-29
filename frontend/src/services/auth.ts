// src/services/auth.ts
import type {
  AuthenticatedUser,
  UserType,
  Artist,
  Label,
  User,
} from '@/types/api';

// Mock база данных
const MOCK_DATABASE: { users: User[]; artists: Artist[]; labels: Label[] } = {
  users: [
    {
      id: 1,
      login: 'artist_john',
      type: 'ARTIST',
      registrationDate: '2024-01-15T10:30:00',
    },
    {
      id: 2,
      login: 'label_neon',
      type: 'LABEL',
      registrationDate: '2024-01-10T09:15:00',
    },
    {
      id: 3,
      login: 'mod_sam',
      type: 'MODERATOR',
      registrationDate: '2024-01-05T14:20:00',
    },
    {
      id: 4,
      login: 'admin_taylor',
      type: 'ADMIN',
      registrationDate: '2024-01-01T08:00:00',
    },
    {
      id: 5,
      login: 'artist_maria',
      type: 'ARTIST',
      registrationDate: '2024-02-01T11:45:00',
    },
  ],
  artists: [
    {
      id: 1,
      name: 'John Rivers',
      labelId: 1,
      country: 'USA',
      realName: 'John Doe',
      userId: 1,
      userLogin: 'artist_john',
    },
    {
      id: 2,
      name: 'Maria Lopez',
      labelId: 1,
      country: 'Spain',
      realName: 'Maria Garcia Lopez',
      userId: 5,
      userLogin: 'artist_maria',
    },
  ],
  labels: [
    {
      id: 1,
      country: 'USA',
      contactName: 'Alex Smith',
      phone: '+1234567890',
      userId: 2,
      userLogin: 'label_neon',
    },
  ],
};

// Маппинг токенов к пользователям
const MOCK_TOKENS: Record<string, number> = {
  artist_token: 1, // John Rivers (ARTIST)
  label_token: 2, // Neon Records (LABEL)
  moderator_token: 3, // Sam Chen (MODERATOR)
  admin_token: 4, // Taylor Kim (ADMIN)
  artist2_token: 5, // Maria Lopez (ARTIST)
};

export const getCurrentUser = async (): Promise<AuthenticatedUser | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const token = localStorage.getItem('auth_token');

  if (!token || !(token in MOCK_TOKENS)) {
    localStorage.removeItem('auth_token');
    return null;
  }

  const userId = MOCK_TOKENS[token];
  const user = MOCK_DATABASE.users.find((u) => u.id === userId);

  if (!user) {
    localStorage.removeItem('auth_token');
    return null;
  }

  // Получаем профиль в зависимости от типа пользователя
  let profile = null;

  if (user.type === 'ARTIST') {
    profile = MOCK_DATABASE.artists.find((a) => a.userId === user.id) || null;
  } else if (user.type === 'LABEL') {
    profile = MOCK_DATABASE.labels.find((l) => l.userId === user.id) || null;
  }

  return {
    user,
    profile,
  };
};

// Вспомогательные функции для логина
export const login = (role: UserType) => {
  const roleTokens: Record<UserType, string> = {
    ARTIST: 'artist_token',
    LABEL: 'label_token',
    MODERATOR: 'moderator_token',
    ADMIN: 'admin_token',
    PLATFORM: 'admin_token', // PLATFORM пока не используется в моках
  };

  localStorage.setItem('auth_token', roleTokens[role]);
  window.location.href = '/dashboard';
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
};
