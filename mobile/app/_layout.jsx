import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { UserProvider, useUser } from '../context/user.context.js';

function RootNavigator() {
  const { token } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('welcome');

  useEffect(() => {
    console.log('🧠 useEffect triggered in RootNavigator');
    const timer = setTimeout(() => {
      console.log('📦 Token from context:', token);
      if (token) {
        console.log('✅ Token exists → navigating to dashboard');
        setInitialRoute('dashboard');
      } else {
        console.log('🚫 No token → navigating to welcome');
        setInitialRoute('welcome');
      }
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [token]);

  if (isLoading) {
    console.log('⏳ Showing splash screen...');
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/splash-icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  console.log('🧭 Rendering Stack with initial route:', initialRoute);
  return (
    <Stack
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    />
  );
}

export default function Layout() {
  console.log('🚀 Layout rendered');
  return (
    <UserProvider>
      <RootNavigator />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090c25',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
});
