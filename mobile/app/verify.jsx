// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import axios from 'axios';

// export default function Verify() {
//   const [otp, setOtp] = useState('');
//   const { phone } = useLocalSearchParams();
//   const router = useRouter();

//   const verifyOtp = async () => {
//     if (otp.length !== 6) {
//       Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP sent to your phone');
//       return;
//     }

//     try {
//       const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp`, {
//         phone,
//         otp,
//       });

//       if (response.data.verified) {
//         router.push('/register');
//       } else {
//         Alert.alert('Verification Failed', response.data.message || 'Invalid OTP');
//       }
//     } catch (error) {
//       console.error('OTP Verify Error:', error?.response?.data || error.message);
//       Alert.alert('Error', 'Something went wrong during OTP verification');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Enter OTP sent to {phone}</Text>
//       <TextInput
//         keyboardType="number-pad"
//         maxLength={6}
//         value={otp}
//         onChangeText={setOtp}
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={verifyOtp} style={styles.button}>
//         <Text style={styles.buttonText}>Verify</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   label: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
//   input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 15 },
//   button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8 },
//   buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Verify() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp`, {
        phone,
        otp,
      });

      if (res.data.success) {
        if (res.data.exists) {
          router.push('/dashboard');
        } else {
          router.push({ pathname: '/profile-add', params: { phone } });
        }
      } else {
        Alert.alert('Invalid OTP', res.data.message || 'Please try again');
      }
    } catch (err) {
      console.error('OTP Verify Error:', err?.response?.data || err.message);
      Alert.alert('Error', 'Something went wrong while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Enter OTP sent to +91 {phone}</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
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
    paddingHorizontal: 24,
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