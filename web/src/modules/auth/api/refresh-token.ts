'use client';

import { apiClient } from "@/lib/api-client";

export async function refreshToken() {
  try {
    const response = await apiClient.post("/auth/refresh");
    return response.data;
  } catch (error) {
    // აქ queryClient არ გვჭირდება, cookie-ებს სერვერი მართავს
    throw error;
  }
}
