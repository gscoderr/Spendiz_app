// 📁 app/components/BottomTabBar.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity onPress={() => router.replace('/dashboard')}>
        <Text style={isActive('/dashboard') ? styles.tabActive : styles.tab}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/creditcards')}>
        <Text style={isActive('/creditcards') ? styles.tabActive : styles.tab}>Credit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/loyalty')}>
        <Text style={isActive('/loyalty') ? styles.tabActive : styles.tab}>Loyalty</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/consult')}>
        <Text style={isActive('/consult') ? styles.tabActive : styles.tab}>Consult</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
   tabBar: {
    backgroundColor: "#0D0D2B",         // ✅ Match TopBar
    flexDirection: "row",
    justifyContent: "space-around",
    // paddingVertical: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#1E1E3F",
  },
  tabItem: {
    alignItems: "center",
  },
  tab: {
    color: '#777',
    fontSize: 14,
  },
  tabActive: {
    color: '#3D5CFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
