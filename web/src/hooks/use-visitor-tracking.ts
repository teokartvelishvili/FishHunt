"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./use-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

// Generate or retrieve session ID
const getSessionId = (): string => {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("visitor_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem("visitor_session_id", sessionId);
  }
  return sessionId;
};

export function useVisitorTracking() {
  const pathname = usePathname();
  const { user } = useAuth();
  const lastTrackedPage = useRef<string>("");
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  const trackVisitor = useCallback(
    async (page: string) => {
      try {
        const sessionId = getSessionId();

        await fetch(`${API_URL}/analytics/track-visitor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page,
            referrer: typeof document !== "undefined" ? document.referrer : "",
            sessionId,
            userId: user?._id || null,
          }),
        });
      } catch (error) {
        // Silent fail - don't break user experience for analytics
        console.debug("Visitor tracking failed:", error);
      }
    },
    [user?._id]
  );

  // Track page views
  useEffect(() => {
    if (pathname && pathname !== lastTrackedPage.current) {
      lastTrackedPage.current = pathname;
      trackVisitor(pathname);
    }
  }, [pathname, trackVisitor]);

  // Heartbeat - send ping every 30 seconds to keep visitor "active"
  useEffect(() => {
    // Initial track
    if (pathname) {
      trackVisitor(pathname);
    }

    // Heartbeat interval
    heartbeatInterval.current = setInterval(() => {
      if (pathname) {
        trackVisitor(pathname);
      }
    }, 30000); // 30 seconds

    // Cleanup
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [pathname, trackVisitor]);

  // Track when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable tracking on page unload
      const sessionId = getSessionId();
      const data = JSON.stringify({
        page: pathname,
        sessionId,
        userId: user?._id || null,
        leaving: true,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          `${API_URL}/analytics/track-visitor`,
          new Blob([data], { type: "application/json" })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, user?._id]);

  return { trackVisitor };
}
