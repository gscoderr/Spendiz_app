import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../utils/axiosInstance.js'
import { useUser } from '../context/user.context.js'; // Adjust the import path as necessary

export default function ProfileAdd() {
  const router = useRouter();
  const { phone, setUser, setToken, setRefreshToken } = useUser();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');



  const handleNext = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Missing Info', 'All fields are required');
      return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email || !emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }


    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    const normalizedPhone = phone?.startsWith('+91') ? phone : `+91${phone}`;

    console.log("Registering user with phone:", normalizedPhone);

    try {
      const res = await api.post(`/auth/register`, {
        phone: normalizedPhone,
        name: fullName,
        email: email,
      });

      if (res.data.success) {
        const { user, accessToken, refreshToken } = res.data.data;
        await setUser(user);
        await setToken(accessToken);
        await setRefreshToken(refreshToken);
        Alert.alert('Success', res.data.message || 'Profile saved successfully');
        router.replace('/dashboard');
      }
    } catch (err) {
      const backendError = err.response?.data?.message || err.message || 'Verification failed';
      console.error('OTP Verify Error:', err.response);
      Alert.alert('Verification Error', backendError);
    }
  };


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.stepText}>STEP 1/3</Text> */}
        <Text style={styles.title}>Enter your full name</Text>
        <Text style={styles.subtitle}>
          Your name lets us welcome you with a unique experience
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D2B',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginTop: 50,
  },
  stepText: {
    color: 'green',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffff',
  },
  form: {
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ccc',
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
});
