import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './url';

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`, // use localhost or your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor to refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      try {
        const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refresh: refreshToken,
        });

        const newToken = res.data.token;
        await AsyncStorage.setItem('authToken', newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
