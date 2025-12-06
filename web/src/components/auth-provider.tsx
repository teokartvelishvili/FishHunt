"use client";

import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userQueryConfig } from "@/modules/auth/user-config";
import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
  isTokenAboutToExpire,
} from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useQuery({
    ...userQueryConfig,
    enabled: true,
  });

  // Proactive token refresh
  useEffect(() => {
    const refreshTokenIfNeeded = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) {
        return;
      }

      // Check if token is about to expire (within 5 minutes)
      if (isTokenAboutToExpire()) {
        console.log("🔄 Proactively refreshing token...");
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            }
          );

          const data = await response.json();

          if (data.tokens?.accessToken && data.tokens?.refreshToken) {
            storeTokens(data.tokens.accessToken, data.tokens.refreshToken);
            console.log("✅ Token refreshed successfully");
          } else {
            console.error("❌ Invalid refresh response");
            clearTokens();
            queryClient.setQueryData(["user"], null);
          }
        } catch (error) {
          console.error("❌ Proactive token refresh failed:", error);
          // Don't clear tokens on proactive refresh failure - let the interceptor handle it
        }
      }
    };

    // Initial check
    refreshTokenIfNeeded();

    // Check every 5 minutes
    refreshIntervalRef.current = setInterval(
      refreshTokenIfNeeded,
      5 * 60 * 1000
    );

    // Also refresh when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshTokenIfNeeded();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [queryClient]);

  return <>{children}</>;
}
