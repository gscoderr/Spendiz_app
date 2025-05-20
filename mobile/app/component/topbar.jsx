import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/user.context.js';
import HeaderBackButton from './backbutton.jsx';
import { useRouter } from 'expo-router';

export default function TopBar({ screen, onFilterPress, onSearchPress }) {

  const { user } = useUser();
  const userName = user?.name || "User";
  const router = useRouter();

  const avatarInitials =
    userName.length === 1
      ? userName[0].toUpperCase()
      : (userName[0] + userName[userName.length - 1]).toUpperCase();

  return (
    <View style={styles.topBar}>
      {screen === "Dashboard" && (
        <>
          <TouchableOpacity
            style={styles.userSection}
            onPress={() => router.push("/screens/profile")}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </View>
            <Text style={styles.greeting}>Hi {userName}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.referBtn}>
            <Text style={styles.referText}>Refer</Text>
          </TouchableOpacity>

          <FontAwesome name="bell" size={20} color="#fff" style={styles.bellIcon} />
        </>
      )}

      {screen === "Credit" && (
        <>
          <HeaderBackButton />
          <Text style={styles.creditTitle}>Credit Cards</Text>
          <View style={styles.iconRow}>
            <Ionicons
              name="funnel-outline"
              size={20}
              color="#fff" 
              style={styles.icon}
              onPress={onFilterPress}
            />
            {/* <Ionicons
              name="search"
              size={20}
              color="#fff"
              onPress={onSearchPress}
            /> */}

          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,         // ✅ Minimize top padding (reduce from 40 to 12)
    paddingBottom: 8,       // ✅ Optional, if needed
    backgroundColor: "#0D0D2B",
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    backgroundColor: "#F2C6D1",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: "#000", fontWeight: "700" },
  greeting: { color: "#fff", fontSize: 18 },

  referBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  referText: { fontWeight: "600", color: "#000" },

  bellIcon: {
    marginLeft: 12,
  },

  creditTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  iconRow: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 12,
  },
});
