import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userQueryConfig } from "../user-config";

export function useUser() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    ...userQueryConfig,
    placeholderData: () => queryClient.getQueryData(["user"]),
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error, // ❗ თუ შეცდომაა, მაინც არ ნიშნავს, რომ არ არის ავტორიზებული
    error,
    isFetching,
  };
}
