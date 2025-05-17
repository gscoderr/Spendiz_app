import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform, Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useUser } from '../context/user.context.js'; // Adjust the import path as necessary

export default function Verify() {

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 const { phone, setPhone, setUser, setToken, setRefreshToken } = useUser(); // Destructure setUser and setToken from the context

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setLoading(true);

      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/verify-otp`, {
        phone,
        otp,
      });

      // console.log('OTP Verify Request:');
      // // console.log("response",res.data.data);
      // console.log('OTP Verify Response:', res.data.data.exists);

      // console.log('OTP Verify Response:', res.data);

      if (res.data.success) {
        const data = res.data.data;

        if (data?.user) {
          await setUser(data.user);
          await setToken(data.accessToken);
          await setRefreshToken(data.refreshToken);
          router.push('/dashboard');
        } else if (data?.exists === false) {
          // New user
          setPhone(phone);
          Alert.alert("Info", res.data.message || "Redirecting to registration");
          router.push('/register');
        } else {
          Alert.alert("Error", "Unexpected response from server.");
        }
      }else {
        Alert.alert("Error", res.data.message || "Verification failed");
      }

    } catch (err) {

      const backendError = err.response?.data?.message || err.message || 'Verification failed';
      console.error('OTP Verify Error:', backendError);
      Alert.alert('Verification Error', backendError);

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.box}>
        <Image source={require('../assets/images/otp-graphic.png')} style={styles.image} />
        <Text style={styles.title}>Enter OTP sent to +91 {phone}</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#fff"
        />
        <View style={styles.button}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Button title="Verify OTP" onPress={handleVerifyOtp} color="#3D5CFF" />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D2B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 26,
  },
  box: {
    width: '100%',
    alignItems: 'center',

  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffff40',
    backgroundColor: '#ffffff10',
    borderRadius: 10,
    padding: 14,
    width: '100%',
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',

  },
});