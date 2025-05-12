import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NextScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Next Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
// https://www.fast2sms.com/dev/bulkV2?authorization=w37M0BZS2x9ozTdUHDgfYq6AGjrEe54Wh1uQIkmpt8bCOKLRvPTN4XYR76P8AGpQOiVyWtzMgnd02Zqu&route=dlt&sender_id=&message=&variables_values=&flash=0&numbers=&schedule_time=