import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import api from "../../utils/axiosInstance";

export default function OfferList() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatched, setShowMatched] = useState(false);
  const [userCards, setUserCards] = useState([]);

  // Fetch user cards from backend
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const res = await api.get("/cards/user");
        setUserCards(res.data.data || []);
        console.log("💳 Fetched user cards from DB:", res.data.data);
      } catch (err) {
        console.error("❌ Error fetching user cards:", err.message);
      }
    };

    fetchUserCards();
  }, []);

  // Fetch all public offers
  const fetchAllOffers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/offers/easemytrip");
      setOffers(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching offers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch offers that match user cards
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
        category: "Travel",
        subCategory: "Flights",
      });
      setOffers(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching matched offers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between all and matched
  const toggleView = () => {
    if (showMatched) {
      fetchAllOffers();
    } else {
      fetchMatchedOffers();
    }
    setShowMatched(!showMatched);
  };

  // Auto-load all offers initially
  useEffect(() => {
    fetchAllOffers();
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
        {showMatched
          ? "No matched offers for your cards."
          : "No offers available."}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>🔥 Offers</Text>
        <TouchableOpacity onPress={toggleView}>
          <Text style={styles.toggleText}>
            {showMatched ? "View All Offers" : "🎯 Your Card Rewards"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {offers.map((item) => (
          <View key={item._id} style={styles.offerCard}>
            <Image
              source={{ uri: item.image || require("../../assets/banks/sbi.png") }}
              style={styles.offerImage}
              resizeMode="cover"
            />

            <Text style={styles.offerTitle}>{item.title}</Text>

            <Text style={styles.offerBenefit} numberOfLines={2} ellipsizeMode="tail">
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
              <Text style={styles.offerLink} onPress={() => Linking.openURL(item.tnc)}>
                View Details →
              </Text>
            )}
          </View>
        ))}
      </View>
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
