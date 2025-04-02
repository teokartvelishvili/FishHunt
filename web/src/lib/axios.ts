import Axios from 'axios';

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
axios.interceptors.request.use((config) => {
  // Ensure credentials are always sent
  config.withCredentials = true;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await axios.post('/auth/refresh', null, { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
