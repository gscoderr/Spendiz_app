// 📁 File: mobile/context/user.context.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';
import api from '../utils/axiosInstance';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [phone, setPhone] = useState('');
  const [tokenReady, setTokenReady] = useState(false); // ✅ Signals completion of auth check

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('📦 Checking stored tokens...');
      try {
        const storedUser = await AsyncStorage.getItem('spendiz_user');
        const storedToken = await AsyncStorage.getItem('spendiz_token');
        const storedRefresh = await AsyncStorage.getItem('spendiz_refresh_token');

        console.log('🔍 storedUser:', storedUser);
        console.log('🔍 storedToken:', storedToken);
        console.log('🔍 storedRefresh:', storedRefresh);

        if (storedUser && storedToken && storedRefresh) {
          const decoded = jwtDecode(storedToken);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (!isExpired) {
            console.log('✅ Access token valid. Restoring user...');
            setUserState(JSON.parse(storedUser));
            setTokenState(storedToken);
            return;
          }

          console.log('🔁 Access token expired. Attempting refresh...');
          const res = await api.post(`/auth/refresh-token`, {
            refreshToken: storedRefresh,
          });

          const { user, accessToken, refreshToken: newRefresh } = res.data.data;

          await AsyncStorage.setItem('spendiz_user', JSON.stringify(user));
          await AsyncStorage.setItem('spendiz_token', accessToken);
          await AsyncStorage.setItem('spendiz_refresh_token', newRefresh);

          setUserState(user);
          setTokenState(accessToken);
          console.log('✅ Token refresh successful.');
        } else {
          console.log('🚫 No tokens found. Skipping auth restore.');
        }
      } catch (err) {
        console.error('❌ Auth initialization error:', err?.response?.data || err.message);
        await logout({ silent: true }); // custom silent logout
      } finally {
        setTokenReady(true); // ✅ Always set this once, at the end
      }
    };

    initializeAuth();
  }, []);

  const setUser = async (user) => {
    setUserState(user);
    await AsyncStorage.setItem('spendiz_user', JSON.stringify(user));
  };

  const setToken = async (accessToken) => {
    setTokenState(accessToken);
    await AsyncStorage.setItem('spendiz_token', accessToken);
  };

  const setRefreshToken = async (refreshToken) => {
    await AsyncStorage.setItem('spendiz_refresh_token', refreshToken);
  };

  const logout = async ({ silent = false } = {}) => {
    await AsyncStorage.multiRemove([
      'spendiz_user',
      'spendiz_token',
      'spendiz_refresh_token',
    ]);
    setUserState(null);
    setTokenState(null);
    setPhone('');

    if (!silent) {
      Alert.alert('Logged Out', 'You have been logged out.');
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        setRefreshToken,
        phone,
        setPhone,
        logout,
        tokenReady,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
