"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/lib/process-refresh";
import { initializeAuth, isTokenAboutToExpire, getAccessToken } from "@/lib/auth";
import { useEffect } from "react";
import { checkAndRefreshAuth } from "@/lib/process-refresh";

// Declare global window property for query client access
declare global {
  interface Window {
    queryClient: {
      setQueryData: (key: unknown[], data: unknown) => void;
    };
  }
}

// Initialize the queryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Make queryClient globally accessible for auth reset during refresh failures
if (typeof window !== "undefined") {
  // Create a compatible object that satisfies the Window.queryClient type
  window.queryClient = {
    setQueryData: (key, data) => {
      // Use a type assertion to handle the compatibility issue
      queryClient.setQueryData(key, () => data);
    },
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize auth when the app starts
  useEffect(() => {
    const initAuth = async () => {
      initializeAuth();

      // Check if we have tokens and potentially refresh them
      const isAuthed = await checkAndRefreshAuth();

      // Update auth state in React Query
      if (isAuthed) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        queryClient.setQueryData(["user"], null);
      }
    };

    initAuth();

    // Proactive token refresh - check every 5 minutes if token needs refresh
    const refreshInterval = setInterval(async () => {
      const accessToken = getAccessToken();
      // Only refresh if logged in and token is about to expire (within 5 min)
      if (accessToken && isTokenAboutToExpire()) {
        await checkAndRefreshAuth();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Also refresh when tab becomes visible again
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const accessToken = getAccessToken();
        if (accessToken && isTokenAboutToExpire()) {
          await checkAndRefreshAuth();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      {children}
    </QueryClientProvider>
  );
}
