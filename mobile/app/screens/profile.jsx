import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useUser } from "../../context/user.context";

export default function ProfileScreen() {

  const { logout, user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout(); // ✅ Clear AsyncStorage + context
              Alert.alert("Logged Out", "You have been logged out successfully.");
              router.replace('/welcome'); // ✅ Go back to login screen
            } catch (error) {
              console.error("Logout Error:", error);
              Alert.alert("Error", "Something went wrong during logout.");
            }
          },
        },
      ]
    );
  };



  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.header}>
        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.phone}>{user?.phone || "No phone number"}</Text>
        <Text style={styles.email}>{user?.email || "No email"}</Text>
      </View>
      {/* Premium Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>
          Subscribe to premium & get exclusive benefits
        </Text>
        <TouchableOpacity style={styles.subscribeBtn}>
          <Text style={styles.subscribeText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>

      {/* Action Items */}
      <View style={styles.menu}>
        <MenuItem
          label="My Details"
          onPress={() => router.push("/my-details")}
          icon="person"
        />
        <MenuItem
          label="Bill Payments History"
          onPress={() => router.push("/payments")}
          icon="document-text"
        />
        <MenuItem
          label="Link Your Gmail"
          onPress={() => router.push("/link-gmail")}
          icon="mail"
          actionLabel="Action Required"
        />
        <MenuItem label="My Buddy Details" locked icon="headset" />
        <MenuItem
          label="Refer and Earn"
          onPress={() => router.push("/refer")}
          icon="megaphone"
        />
        <MenuItem
          label="Join WhatsApp Channel"
          onPress={() => Linking.openURL("https://wa.me/yourchannel")}
          icon="logo-whatsapp"
        />
        <MenuItem
          label="Overview Video"
          onPress={() => router.push("/overview")}
          icon="logo-youtube"
        />
        <MenuItem
          label="Share Feedback"
          onPress={() => router.push("/feedback")}
          icon="flag"
        />
      </View>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const MenuItem = ({ label, onPress, icon, actionLabel, locked }) => (
  <TouchableOpacity style={styles.item} onPress={onPress} disabled={locked}>
    <Ionicons name={icon} size={20} color="#ffff" />
    <Text style={styles.itemLabel}>{label}</Text>
    {actionLabel && (
      <View style={styles.actionBadge}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </View>
    )}
    {locked ? (
      <Ionicons name="lock-closed" size={16} color="#fff" />
    ) : (
      <Ionicons name="chevron-forward" size={18} color="#ffff" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D2B", padding: 20, paddingTop: 60 },
  header: { marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  phone: { fontSize: 16, color: "#fff" },
  email: { fontSize: 16, color: "#fff" },

  banner: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subscribeBtn: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  subscribeText: { color: "#2563eb", fontWeight: "600" },

  menu: { marginTop: 10 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: "#eee",
  },
  itemLabel: { flex: 1, marginLeft: 10, fontSize: 16, color: "#ffff" },
  actionBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 10,
  },
  actionText: { color: "#b91c1c", fontSize: 12, fontWeight: "600" },
  logoutBtn: {
    marginTop: 30,
    marginBottom: 100,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
