'use client';

import { apiClient } from "@/lib/api-client";
import { User } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;  // წავშალეთ token-ები
}

interface SellerRegisterData {
  storeName: string;
  storeLogo?: string;
  ownerFirstName: string;
  ownerLastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  identificationNumber: string;
  accountNumber: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (data: LoginCredentials & { name: string }) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  sellerRegister: async (data: SellerRegisterData) => {
    const response = await apiClient.post("/auth/sellers-register", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<User>("/auth/profile");
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};
