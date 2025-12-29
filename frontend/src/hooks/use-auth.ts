// src/hooks/use-auth.ts

import { useQuery } from '@tanstack/react-query';
import type { AuthenticatedUser, UserType } from '@/types/api';
import { getCurrentUser } from '@/services/auth';

export const useAuth = () => {
  return useQuery<AuthenticatedUser | null>({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useHasRole = (requiredRole: UserType) => {
  const { data: authData } = useAuth();
  return authData?.user.type === requiredRole;
};

export const useHasAnyRole = (allowedRoles: UserType[]) => {
  const { data: authData } = useAuth();
  return authData?.user && allowedRoles.includes(authData.user.type);
};

export const useProfile = () => {
  const { data: authData } = useAuth();
  return authData?.profile;
};
