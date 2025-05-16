import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {UserProvider} from '../context/user.context.js'; 

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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

  return (
    <UserProvider>
      <Stack
        initialRouteName="welcome"
        screenOptions={{ headerShown: false }}
      />
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
