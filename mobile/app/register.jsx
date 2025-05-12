import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { phone } = useLocalSearchParams();
  const router = useRouter();

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Missing Fields', 'Please enter both name and email.');
      return;
    }

    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
        phone,
        name,
        email,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Profile saved successfully');
        router.push('/dashboard'); // change route if needed
      } else {
        Alert.alert('Failed', res.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register Error:', error?.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong during registration');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Your Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Enter Your Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#000', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
