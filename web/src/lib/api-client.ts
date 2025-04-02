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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await apiClient.post('/auth/refresh');
        return apiClient(error.config);
      } catch (e) {
        console.error('Refresh token failed:', e);
        // Handle refresh token failure
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
