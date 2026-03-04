// src/lib/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:3001/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ADDED CHECK: Ensure we don't try to refresh if the failing request WAS the refresh request or login
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh-tokens' && 
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;

      try {
        // Use axios directly here to avoid triggering the interceptor again if this fails, 
        // OR just rely on the url check above. The url check is usually enough.
        const { data } = await api.post('/auth/refresh-tokens');
        
        localStorage.setItem('accessToken', data.data.accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);