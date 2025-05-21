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
  const [selectedCategory, setSelectedCategory] = useState(null);

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

        <View style={styles.cardSection}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Your Cards</Text>
            {savedCards.length >= 1 && (
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
              <View style={styles.cardHeader}>
                <Text style={styles.bank}>{savedCards[0].bank}</Text>
                <Text style={styles.cardType}>{savedCards[0].cardName}</Text>
              </View>

              <View style={styles.cardChip} />

              <Text style={styles.last4}>
                •••• •••• •••• {savedCards[0].last4Digits}
              </Text>
              <Text style={styles.holder}>{savedCards[0].cardHolderName}</Text>

              <TouchableOpacity style={styles.payNowBtn}>
                {/* <Text style={styles.payNowText}>Pay Now</Text> */}
              </TouchableOpacity>

              <View style={styles.networkLogoWrapper}>
                <Image
                  source={
                    savedCards[0].network === "Visa"
                      ? require("../../assets/banks/visa_sign.png")
                      : require("../../assets/banks/master_card.png")
                  }
                  style={styles.networkLogo}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>

        {/* <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Spend Category</Text>

          <View style={styles.categoryPillRow}>
            {[
              { label: "Dining", icon: "🍴", category: "dining" },
              { label: "Shopping", icon: "🛍️", category: "shopping" },
              { label: "Travel", icon: "✈️", category: "travel" },
              { label: "Entertainment", icon: "🎬", category: "entertainment" },
              { label: "Fuel", icon: "⛽", category: "fuel" },
              { label: "Grocery", icon: "🛒", category: "grocery" },
            ].map(({ label, icon, category }) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryPill}
                onPress={() =>
                  router.push({
                    pathname: "/screens/subcategory",
                    params: { category },
                  })
                }
              >
                <Text style={styles.pillIcon}>{icon}</Text>
                <Text style={styles.pillLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Spend Category</Text>

          <View style={styles.categoryGrid}>
            {[
              { label: "Dining", icon: "🍴", category: "dining" },
              { label: "Shopping", icon: "🛍️", category: "shopping" },
              { label: "Travel", icon: "✈️", category: "travel" },
              { label: "Entertainment", icon: "🎬", category: "entertainment" },
              { label: "Fuel", icon: "⛽", category: "fuel" },
              { label: "Grocery", icon: "🛒", category: "grocery" },
              // { label: "EMI", icon: "💸", category: "emi" },
              // { label: "Fuel", icon: "⛽", category: "fuel" },
              // { label: "Government", icon: "🏛️", category: "government" },
              // { label: "Jewellery", icon: "💎", category: "jewellery" },
              // { label: "Rent", icon: "🏠", category: "rent" },
              // { label: "Utilities", icon: "🔌", category: "utilities" },
              // { label: "Wallets", icon: "👛", category: "wallets" },
            ].map(({ label, icon, category }) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryIconBox}
                onPress={() =>
                  router.push({
                    pathname: "/screens/subcategory",
                    params: { category },
                  })
                }
              >
                <View style={styles.categoryIconCircle}>
                  <Text style={styles.iconEmoji}>{icon}</Text>
                </View>
                <Text style={styles.categoryLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  cardBox: {
    backgroundColor: "#1B3C73", // solid dark blue
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: "100%",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  bank: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  cardType: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  cardChip: {
    width: 40,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#cccccc",
    marginBottom: 20,
  },

  last4: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 4,
  },

  holder: {
    color: "#fff",
    fontSize: 20,
    marginTop: 6,
  },

  // payNowBtn: {
  //   backgroundColor: "#fff",
  //   paddingVertical: 8,
  //   paddingHorizontal: 16,
  //   borderRadius: 20,
  //   alignSelf: "flex-start",
  //   marginTop: 10,
  // },

  // payNowText: {
  //   color: "#000",
  //   fontWeight: "600",
  // },

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
  networkLogoWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  networkLogo: {
    width: 150,
    height: 70,
  },
  categoryRow: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 8,
  },

  categoryPill: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },

  selectedPill: {
    backgroundColor: "#3D5CFF",
  },

  pillText: {
    fontWeight: "600",
    color: "#000",
  },

  offerScroll: {
    marginTop: 16,
  },

  offerCard: {
    backgroundColor: "#f7f9ff",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 180,
    elevation: 2,
  },

  offerCardBank: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1B3C73",
  },

  offerCardName: {
    fontSize: 13,
    marginTop: 4,
    color: "#333",
  },

  offerCardPerk: {
    fontSize: 12,
    marginTop: 6,
    color: "#555",
  },

  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },

  categoryGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: 12,
  rowGap: 24,
},

categoryIconBox: {
  width: "28%",
  alignItems: "center",
},

categoryIconCircle: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#eef0ff",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 8,
},

iconEmoji: {
  fontSize: 24,
},

categoryLabel: {
  fontSize: 13,
  fontWeight: "500",
  color: "#000",
  textAlign: "center",
},

});
