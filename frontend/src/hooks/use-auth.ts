// src/hooks/use-auth.ts
import { useQuery } from '@tanstack/react-query';
import type { User, UserType } from '@/types/api';
import { getCurrentUser } from '@/services/auth-helpers';
import { clearAuthToken } from '@/services/api';
import { queryClient } from '@/providers/query-client';
import { useRouter } from '@tanstack/react-router';

export const useAuth = () => {
  const router = useRouter();

  const query = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const logout = async () => {
    clearAuthToken();
    localStorage.removeItem('user');
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    queryClient.clear();
    router.invalidate();
  };
  return {
    ...query,
    logout,
    isAuthenticated: !!query.data && !query.isLoading && !query.isError,
  };
};

export const useHasRole = (requiredRole: UserType) => {
  const { data } = useAuth();
  return data?.type === requiredRole;
};

export const useHasAnyRole = (allowedRoles: UserType[]) => {
  const { data } = useAuth();
  return data && allowedRoles.includes(data.type);
};
