import { createContext, useContext, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../services/api';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null; isLoading: boolean;
  login: (input: { email: string; password: string }) => Promise<User>;
  register: (input: { name: string; email: string; phone?: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const me = useQuery({
    queryKey: ['me'], queryFn: () => api<User>('/auth/me'), retry: false,
    throwOnError: false,
  });
  const loginMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) => api<User>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: (user) => client.setQueryData(['me'], user),
  });
  const registerMutation = useMutation({
    mutationFn: (input: { name: string; email: string; phone?: string; password: string }) => api<User>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: (user) => client.setQueryData(['me'], user),
  });

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    client.setQueryData(['me'], null);
    client.removeQueries({ queryKey: ['bookings'] });
  };

  const user = me.error instanceof ApiError && me.error.status === 401 ? null : (me.data ?? null);
  return <AuthContext.Provider value={{ user, isLoading: me.isLoading, login: loginMutation.mutateAsync, register: registerMutation.mutateAsync, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

