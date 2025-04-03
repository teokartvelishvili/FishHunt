'use client';

import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getProfile,
    initialData: null,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  return {
    user,
    isLoading: isLoading && user === undefined,
    isAuthenticated: !!user,
    error: null
  };
}
