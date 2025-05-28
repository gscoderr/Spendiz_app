
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Constants from 'expo-constants';

// 🧠 Use manifest for better cross-platform compatibility
const BASE_URL = 'http://192.168.212.6:5000';
console.log("✅ BASE_URL →", BASE_URL); // Debug log

const api = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
});
        

// ✅ Request Interceptor
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('spendiz_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Response Interceptor (Token Expiry Handler)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const refreshToken = await AsyncStorage.getItem('spendiz_refresh_token');

        // 🔁 If access token expired, try to refresh
        if (status === 401 && !originalRequest._retry && refreshToken) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh-token`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefresh, user } = res.data.data;

                await AsyncStorage.setItem('spendiz_token', accessToken);
                await AsyncStorage.setItem('spendiz_refresh_token', newRefresh);
                await AsyncStorage.setItem('spendiz_user', JSON.stringify(user));

                // 🔁 Set new token in header and retry request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (refreshErr) {
                console.error('🔒 Refresh failed:', refreshErr?.response?.data || refreshErr);
                await AsyncStorage.multiRemove([
                    'spendiz_token',
                    'spendiz_refresh_token',
                    'spendiz_user',
                ]);
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
