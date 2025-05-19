import api from "../../utils/axiosInstance.js";
import React, { useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useUser } from "../../context/user.context.js";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../component/topbar.jsx";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const userName = user?.name || "User";
  const [savedCards, setSavedCards] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchSavedCards = async () => {
        try {
          const res = await api.get("/cards/user");
          setSavedCards(res.data.data);
        } catch (err) {
          console.error("❌ Error fetching saved cards:", err.message);
        }
      };
      fetchSavedCards();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D0D2B" }}>
      <TopBar screen="Dashboard" />

      <ScrollView contentContainerStyle={styles.bodyContainer}>
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>⚠️ You have 1 pending action</Text>
          <TouchableOpacity>
            <Text style={styles.viewLink}>View</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rewardBox}>
          <Text style={styles.points}>0 Points</Text>
          <Text style={styles.subText}>Fetch your reward points</Text>
          <TouchableOpacity style={styles.gmailButton}>
            <Text style={styles.gmailText}>Connect Gmail</Text>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png",
              }}
              style={styles.gmailIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardSection}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Your Cards</Text>
            {savedCards.length > 1 && (
              <TouchableOpacity onPress={() => router.push("/creditcards")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {savedCards.length === 0 ? (
            <TouchableOpacity
              style={styles.addCard}
              onPress={() => router.push("/screens/addcard")}
            >
              <Text style={styles.addIcon}>＋</Text>
              <Text style={styles.addText}>
                Add your cards to view rewards & offers
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cardBox}>
              <Text style={styles.bank}>{savedCards[0].bank}</Text>
              <Text style={styles.last4}>•••• {savedCards[0].last4Digits}</Text>
              <Text style={styles.holder}>{savedCards[0].cardHolderName}</Text>
              <TouchableOpacity style={styles.payNowBtn}>
                <Text style={styles.payNowText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Spend Category</Text>

          {[
            { label: "Dining", icon: "🍴", category: "dining" },
            { label: "Shopping", icon: "🛍️", category: "shopping" },
            { label: "Travel", icon: "✈️", category: "travel" },
            { label: "Entertainment", icon: "🎬", category: "entertainment" },
          ].map(({ label, icon, category }) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryItem}
              onPress={() =>
                router.push({ pathname: "/subcategory", params: { category } })
              }
            >
              <View style={styles.iconCircle}>
                <Text style={styles.icon}>{icon}</Text>
              </View>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.askSavvy}>
        <Text style={styles.askSavvyText}>Ask Sandy</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  alertBox: {
    flexDirection: "row",
    backgroundColor: "#fff5e5",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  alertText: { color: "#000", fontSize: 14 },
  viewLink: { color: "#3D5CFF", fontWeight: "600" },

  rewardBox: {
    alignItems: "center",
    backgroundColor: "#f0f2ff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  points: { fontSize: 28, fontWeight: "700" },
  subText: { color: "#555", marginTop: 6 },
  gmailButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 2,
  },
  gmailText: { fontWeight: "600", marginRight: 6 },
  gmailIcon: { width: 18, height: 18 },

  cardSection: { marginBottom: 20 },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  viewAllText: {
    textAlign: "right",
    color: "#3D5CFF",
    fontWeight: "600",
    fontSize: 14,
  },
  cardBox: {
    backgroundColor: "#1E1E3F",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  bank: { color: "#fff", fontSize: 16, fontWeight: "700" },
  last4: { color: "#ccc", fontSize: 14, marginTop: 4 },
  holder: { color: "#fff", fontSize: 14, marginTop: 6 },
  payNowBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  payNowText: { color: "#000", fontWeight: "600" },

  addCard: {
    backgroundColor: "#1E1E3F",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  addIcon: { fontSize: 32, color: "#fff", marginBottom: 8 },
  addText: {
    color: "#ccc",
    textAlign: "center",
    fontSize: 14,
  },

  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconCircle: {
    backgroundColor: "#f0f0ff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: { fontSize: 20 },
  label: { flex: 1, fontSize: 16, fontWeight: "500" },
  arrow: { fontSize: 22, color: "#888" },

  askSavvy: {
    position: "absolute",
    right: 20,
    bottom: 90,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    zIndex: 10,
  },
  askSavvyText: {
    color: "#fff",
    fontWeight: "600",
  },
});
