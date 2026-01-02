// src/hooks/use-auth.ts

import { useQuery } from '@tanstack/react-query';
import type { User, UserType } from '@/types/api';
import { getCurrentUser } from '@/services/auth-helpers';
import { clearAuthToken } from '@/services/api';
import { queryClient } from '@/providers/query-client';

export const useAuth = () => {
  const query = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const logout = () => {
    clearAuthToken();
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    queryClient.clear();
  };

  return {
    ...query,
    logout,
    isAuthenticated: !!query.data,
    user: query.data,
  };
};

export const useHasRole = (requiredRole: UserType) => {
  const { data: authData } = useAuth();
  return authData?.type === requiredRole;
};

export const useHasAnyRole = (allowedRoles: UserType[]) => {
  const { data: authData } = useAuth();
  return authData && allowedRoles.includes(authData.type);
};
