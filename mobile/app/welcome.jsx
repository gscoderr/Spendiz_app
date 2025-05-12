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
      <View style={styles.box}>
        <Text style={styles.label}>Enter Your Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '80%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});
