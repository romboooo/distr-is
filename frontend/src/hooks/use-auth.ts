// src/hooks/use-auth.ts
import { useQuery } from '@tanstack/react-query';
import type { User, UserType } from '@/types/api';
import { clearAuthToken, getAuthToken, getCurrentUser } from '@/services/api';
import { loginUser } from '@/services/login';
import { queryClient } from '@/providers/query-client';

export const useAuth = () => {
  const query = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: () => !!getAuthToken(), // Only fetch if token exists
  });

  const login = async (credentials: { login: string; password: string }) => {
    try {
      const loginResponse = await loginUser(credentials);

      const user: User = {
        id: loginResponse.user.id,
        login: loginResponse.user.login,
        type: loginResponse.user.type as UserType,
        registrationDate: loginResponse.user.registrationDate,
      };

      queryClient.setQueryData<User>(['auth', 'me'], user);

      return user;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = async () => {
    clearAuthToken();

    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    queryClient.setQueryData<User | null>(['auth', 'me'], null);
  };

  const hasRole = (requiredRole: UserType) => {
    return query.data?.type === requiredRole;
  };

  const hasAnyRole = (allowedRoles: UserType[]) => {
    return query.data && allowedRoles.includes(query.data.type);
  };

  return {
    ...query,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!query.data && !query.isLoading && !query.isError,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
