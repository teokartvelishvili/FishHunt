import { apiClient } from "@/lib/api-client";
import { User } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
      { withCredentials: true }
    );
    return response.data;
  },

  register: async (data: LoginCredentials & { name: string }) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      data,
      { withCredentials: true }
    );
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<User>("/auth/profile", {
      withCredentials: true,
    });
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout", {}, { withCredentials: true });
  },
};
