"use client";

import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export function VisitorTracker() {
  useVisitorTracking();
  return null; // This component doesn't render anything
}
