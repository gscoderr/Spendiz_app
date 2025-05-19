import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/user.context.js';

export default function TopBar({ screen }) {
  const navigation = useNavigation();
  const { user } = useUser();
  const userName = user?.name || "User";

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
            onPress={() => navigation.navigate("profile")}
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
          <Text style={styles.creditTitle}>Credit Cards</Text>
          <View style={styles.iconRow}>
            <Ionicons
              name="funnel-outline"
              size={20}
              color="#fff"
              style={styles.icon}
              onPress={() => {
                // handle filter tap if needed
              }}
            />
            <Ionicons name="search" size={20} color="#fff" />
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
    padding: 16,
    paddingTop: 40,
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
