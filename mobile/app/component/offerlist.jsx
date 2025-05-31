// 📁 components/OfferList.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import api from "../../utils/axiosInstance";

export default function OfferList({
  title = "🔥 Offers",
  platform = "easemytrip",
  category = "Travel",
  subCategory = "Flights",
}) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatched, setShowMatched] = useState(true); // ✅ default to matched
  const [userCards, setUserCards] = useState([]);

  // ✅ 1. Fetch user's saved cards from DB
  const fetchUserCards = async () => {
    try {
      const res = await api.get("/cards/user");
      setUserCards(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching user cards:", err.message);
    }
  };

  // ✅ 2. Fetch all public offers for the platform
  const fetchAllOffers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/offers/${platform}`);
      setOffers(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching offers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 3. Fetch only matched offers
  const fetchMatchedOffers = async () => {
    setLoading(true);
    if (!userCards || userCards.length === 0) {
      console.warn("⚠️ No saved cards found. Skipping matched fetch.");
      setOffers([]);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/offers/matching", {
        cards: userCards,
        category,
        subCategory,
      });
      setOffers(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching matched offers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 4. Toggle view logic (fixes reversed logic)
  const toggleView = () => {
    const next = !showMatched;
    setShowMatched(next);
    next ? fetchMatchedOffers() : fetchAllOffers();
  };

  // ✅ 5. Initial load → get cards → fetch matched
  useEffect(() => {
    fetchUserCards()
    fetchMatchedOffers(); // default load
    
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#3D5CFF"
        style={{ marginTop: 24 }}
      />
    );
  }

  if (offers.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        {showMatched ? "No matched offers." : "No offers available."}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={toggleView}>
          <Text style={styles.toggleText}>
            {showMatched ? "View All Offers" : "🎯 Your Card Rewards"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {offers.map((item) => (
          <View key={item._id} style={styles.offerCard}>
            <Image
              source={{
                uri: item.image || require("../../assets/banks/sbi.png"),
              }}
              style={styles.offerImage}
              resizeMode="cover"
            />
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text
              style={styles.offerBenefit}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.benefit || "Special offer available!"}
            </Text>
            <Text style={styles.offerBank}>{item.bank}</Text>
            <Text style={styles.offerExpiry}>
              Valid till:{" "}
              {new Date(item.validTill).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
            {item.tnc && (
              <Text
                style={styles.offerLink}
                onPress={() => Linking.openURL(item.tnc)}
              >
                View Details →
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#000",
  },
  toggleText: {
    color: "#3D5CFF",
    fontWeight: "600",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  offerCard: {
    backgroundColor: "#eef0ff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    width: "48%",
  },
  offerImage: {
    width: "100%",
    aspectRatio: 3.5,
    borderRadius: 8,
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  offerBenefit: {
    fontSize: 12,
    color: "#444",
    lineHeight: 16,
    marginBottom: 4,
  },
  offerBank: {
    fontSize: 12,
    color: "#555",
  },
  offerExpiry: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  offerLink: {
    marginTop: 6,
    color: "#3D5CFF",
    fontSize: 12,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
