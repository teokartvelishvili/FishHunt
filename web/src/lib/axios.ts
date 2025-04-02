import axios from "axios";
import { refreshToken } from "@/modules/auth/api/refresh-token";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// საჯარო მარშრუტები, რომლებიც არ საჭიროებენ ავტორიზაციას
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/sellers-register",
  "/login",
  "/register",
  "/sellers-register",
  "/",
  "forgot-password",
  "reset-password",
  "profile",
  "logout",
  "products",
  "product/:id",
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshToken();
        processQueue(null, "refreshed");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        const currentPath = window.location.pathname;
        const isPublicRoute = publicRoutes.some(
          (route) => currentPath.includes(route) || originalRequest.url?.includes(route)
        );

        if (!isPublicRoute) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance as axios };
