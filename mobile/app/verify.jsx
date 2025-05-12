import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Verify() {
  const [otp, setOtp] = useState('');
  const { phone } = useLocalSearchParams();
  const router = useRouter();

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP sent to your phone');
      return;
    }

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp`, {
        phone,
        otp,
      });

      if (response.data.verified) {
        router.push('/register');
      } else {
        Alert.alert('Verification Failed', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP Verify Error:', error?.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong during OTP verification');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP sent to {phone}</Text>
      <TextInput
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
      />
      <TouchableOpacity onPress={verifyOtp} style={styles.button}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
