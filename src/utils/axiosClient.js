// ✅ axiosClient.js — handles token refresh automatically
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

const axiosClient = axios.create({
  baseURL: 'https://backend-y5mo.onrender.com/api',
});

axiosClient.interceptors.request.use(async (config) => {
  let token = await SecureStore.getItemAsync('token');
  const refreshToken = await SecureStore.getItemAsync('refreshToken');

  if (token) {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired && refreshToken) {
      try {
        const res = await axios.post('https://backend-y5mo.onrender.com/api/auth/refresh', {
          refreshToken,
        });
        token = res.data.token;
        await SecureStore.setItemAsync('token', token);
      } catch (err) {
        console.error('Token refresh failed:', err);
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refreshToken');
        throw err;
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

export default axiosClient;