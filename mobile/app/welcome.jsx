import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Image } from 'react-native';

export default function Welcome() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGetStarted = async () => {
        if (phone.length !== 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/send-otp`, {
                phone,
            });

            if (response.data.success) {
                router.push({ pathname: '/verify', params: { phone } });
            } else {
                Alert.alert('Failed', response.data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Axios OTP Error:', error?.response?.data || error.message);
            Alert.alert('Error', 'Something went wrong while sending OTP');
        } finally {
            setLoading(false);
        }
    };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.box}>
        <Image
          source={require('../assets/images/wallet-icon.png')} // 👈 update with your actual path
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Welcome to Spendiz</Text>
        <Text style={styles.tagline}>Manage your credit cards & offers smartly</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          placeholderTextColor="#fff"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D2B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  box: {
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    width: 200,
    height: 200,
    // marginBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center'
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
    backgroundColor: '#3D5CFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});
