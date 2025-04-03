'use client';

import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";


export function useUser() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const data = await authApi.getProfile();
        // Store user data in localStorage for iOS compatibility
        if (data) {
          localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
      } catch (error) {
        // Try to get cached user from localStorage
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          return JSON.parse(cachedUser);
        }
        throw error;
      }
    },
    initialData: () => {
      // Try to get cached user from localStorage on initial load
      if (typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('user');
        return cachedUser ? JSON.parse(cachedUser) : null;
      }
      return null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  return {
    user,
    isLoading: isLoading && user === undefined,
    isAuthenticated: !!user,
    error
  };
}
