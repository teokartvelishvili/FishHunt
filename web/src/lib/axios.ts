import Axios from 'axios';

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await axios.post('/auth/refresh', {}, { withCredentials: true });
        // If successful, retry the original request
        return axios(error.config);
      } catch (error) {
        console.error('Refresh token failed:', error);
        // If refresh fails, redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
