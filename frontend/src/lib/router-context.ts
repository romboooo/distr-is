// src/lib/router-context.ts
import type { QueryClient } from '@tanstack/react-query';
import type { User } from '@/types/api';

export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => Promise<void>;
}

export interface RouterContext {
  auth: AuthContext;
  queryClient: QueryClient;
}

// For module augmentation
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof import('@/providers/router').router;
  }
}
