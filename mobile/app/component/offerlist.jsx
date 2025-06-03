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
import { normalizeBankName } from "../../utils/bankSynonymMap";

export default function OfferList({
  title = "🔥 Offers",
  platform = "easemytrip",
  category = "Travel",
  subCategory = "Flights",
}) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatched, setShowMatched] = useState(true);
  const [userCards, setUserCards] = useState([]);

  const fetchUserCards = async () => {
    try {
      const res = await api.get("/cards/user");
      const cards = res.data.data || [];

      console.log("👤 User Cards:");
      cards.forEach((card) => {
        const normBank = normalizeBankName(card.bank);
        console.log(`- ${card.bank} (${normBank}) | ${card.cardName}`);
      });

      setUserCards(cards);
      return cards;
    } catch (err) {
      console.error("❌ Error fetching user cards:", err.message);
      return [];
    }
  };

  const fetchMatchedOffers = async (cards = userCards) => {
    setLoading(true);

    if (!cards || cards.length === 0) {
      console.warn("⚠️ No cards to match. Skipping matched offers.");
      setOffers([]);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/offers/matching", {
        cards,
        category,
        subCategory,
      });

      const matchedOffers = res.data.data || [];

      console.log("🎯 Matched Offers:");
      matchedOffers.forEach((offer) => {
        console.log(
          `➡️ ${offer.bank} | ${offer.cardNames?.join(", ") || "All Cards"}`
        );
      });

      setOffers(matchedOffers);
    } catch (error) {
      console.error("❌ Error fetching matched offers:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOffers = async () => {
    setLoading(true);
    try {
      // Step 1: Get user cards
      const resCards = await api.get("/cards/user");
      const cards = resCards.data.data || [];
      const userBanks = [
        ...new Set(cards.map((c) => normalizeBankName(c.bank)).filter(Boolean)),
      ];
      console.log("👤 Normalized User Banks:", userBanks);

      // Step 2: Fetch all public offers
      const res = await api.get(`/offers/${platform}`);
      const allOffers = res.data.data || [];

      // Step 3: Filter offers by normalized bank name
      const filteredOffers = allOffers.filter((o) =>
        userBanks.includes(normalizeBankName(o.bank))
      );

      const matchedBanks = [
        ...new Set(filteredOffers.map((o) => normalizeBankName(o.bank))),
      ];
      console.log("🌐 Banks in View All Offers (filtered):", matchedBanks);
      console.log("📦 Total Filtered Offers:", filteredOffers.length);

      setOffers(filteredOffers);
    } catch (error) {
      console.error("❌ Error fetching all offers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    const next = !showMatched;
    setShowMatched(next);
    next ? fetchMatchedOffers() : fetchAllOffers();
  };

  useEffect(() => {
    const init = async () => {
      const cards = await fetchUserCards();
      if (cards.length > 0) {
        console.log("🎯 Matched offers will be shown first");
        fetchMatchedOffers(cards);
      } else {
        console.warn("🟡 No cards found. Loading all offers instead.");
        setShowMatched(false);
        fetchAllOffers();
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#3D5CFF" style={{ marginTop: 24 }} />
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

      {loading && (
        <ActivityIndicator size="large" color="#3D5CFF" style={{ marginTop: 24 }} />
      )}

      {!loading && offers.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          {showMatched ? "No matched offers." : "No offers available."}
        </Text>
      )}

      {!loading && offers.length > 0 && (
        <ScrollView contentContainerStyle={styles.grid}>
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
      )}
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
