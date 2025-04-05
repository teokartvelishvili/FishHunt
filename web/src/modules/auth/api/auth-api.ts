'use client';

import { axios } from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
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
    const response = await axios.post<AuthResponse>("/auth/login", credentials);
    if (response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken); 
    }
    return response.data;
  },

  register: async (data: LoginCredentials & { name: string }) => {
    // რეგისტრაცია
    await axios.post("/auth/register", data);
    // ავტომატური ავტორიზაცია
    return authApi.login({
      email: data.email,
      password: data.password
    });
  },

  sellerRegister: async (data: SellerRegisterData) => {
    // გამყიდველის რეგისტრაცია 
    await axios.post("/auth/sellers-register", data);
    // ავტომატური ავტორიზაცია
    return authApi.login({
      email: data.email, 
      password: data.password
    });
  },

  getProfile: async () => {
    try {
      const response = await axios.get<User>("/auth/profile");
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      return null;
    }
  },

  logout: async () => {
    try {
      // First clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Then call logout endpoint
      await axios.post("/auth/logout");
    } catch (error) {
      // If API call fails, tokens are already cleared
      console.error('Logout API error:', error);
      throw error;
    }
  }
};
