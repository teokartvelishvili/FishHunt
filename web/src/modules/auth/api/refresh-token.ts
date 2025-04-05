import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/app/providers";

export async function refreshToken() {
  try {
    console.log("Attempting refresh token...");
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await apiClient.post(
      "/auth/refresh",
      { refreshToken },
      {
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      }
    );
    
    console.log("Refresh response:", response.data);
    if (!response.data?.success) {
      throw new Error("Refresh failed");
    }
    
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  } catch (error) {
    console.error("Refresh error:", error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    queryClient.setQueryData(["user"], null);
    throw error;
  }
}
