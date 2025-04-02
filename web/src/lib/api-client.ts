'use client';

import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        await apiClient.post('/auth/refresh');
        isRefreshing = false;
        return apiClient(originalRequest);
      } catch {
        isRefreshing = false;
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
