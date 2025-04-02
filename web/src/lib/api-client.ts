import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
    // Still redirect to login page even if logout fails
    window.location.href = '/login';
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      
      if (originalRequest.url?.includes('/auth/refresh')) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        await apiClient.post('/auth/refresh');
        return apiClient(originalRequest);
      } catch (e) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
