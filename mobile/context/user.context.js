// 📁 File: mobile/context/user.context.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [phone, setPhone] = useState('');

  // ✅ Check and restore tokens on load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('📦 Checking stored tokens...');

      const storedUser = await AsyncStorage.getItem('spendiz_user');
      const storedToken = await AsyncStorage.getItem('spendiz_token');
      const storedRefresh = await AsyncStorage.getItem('spendiz_refresh_token');

      console.log('🔍 storedUser:', storedUser);
      console.log('🔍 storedToken:', storedToken);
      console.log('🔍 storedRefresh:', storedRefresh);

      if (storedUser && storedToken && storedRefresh) {
        try {
          const decoded = jwtDecode(storedToken);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (!isExpired) {
            console.log('✅ Access token valid. Restoring user...');
            setUserState(JSON.parse(storedUser));
            setTokenState(storedToken);
            return;
          } else {
            console.log('🔁 Access token expired. Attempting refresh...');

            const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/refresh-token`, {
              refreshToken: storedRefresh,
            });

            const { user, accessToken, refreshToken } = res.data.data;

            await AsyncStorage.setItem('spendiz_user', JSON.stringify(user));
            await AsyncStorage.setItem('spendiz_token', accessToken);
            await AsyncStorage.setItem('spendiz_refresh_token', refreshToken);

            setUserState(user);
            setTokenState(accessToken);

            console.log('✅ Token refresh successful.');
            return;
          }
        } catch (err) {
          console.error('❌ Auth initialization error:', err?.response?.data || err.message);
          Alert.alert('Session Expired', ' Please log in again.');
          await logout();
        }
      } else {
        console.log('🚫 No tokens found. Skipping auth restore.');
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

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'spendiz_user',
      'spendiz_token',
      'spendiz_refresh_token',
    ]);
    setUserState(null);
    setTokenState(null);
    setPhone('');
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
