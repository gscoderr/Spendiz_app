import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import api from "../../utils/axiosInstance";
import { normalizeBankName } from "../../utils/bankSynonymMap.js";
import OfferDetails from "./offerDetails.jsx";

export default function OfferList({
  title = "🔥 Offers",
  platform = "all",
  category = "Travel",
  subCategory = "Flights",
}) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatched, setShowMatched] = useState(true);
  const [userCards, setUserCards] = useState([]);

  const [selectedOfferId, setSelectedOfferId] = useState(null); // ✅ new
  const [showModal, setShowModal] = useState(false); // ✅ new

  const fetchUserCards = async () => {
    try {
      const res = await api.get("/cards/user");
      const cards = res.data.data || [];

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

      setOffers(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching matched offers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOffers = async () => {
    setLoading(true);
    try {
      const resCards = await api.get("/cards/user");
      const userCards = resCards.data.data || [];

      const userCardMap = {};
      userCards.forEach((card) => {
        const bankKey = normalizeBankName(card.bank);
        const cardName = card.cardName?.trim();
        if (!bankKey || !cardName) return;
        if (!userCardMap[bankKey]) userCardMap[bankKey] = new Set();
        userCardMap[bankKey].add(cardName);
      });

      const res = await api.get(`/offers/all`);
      const allOffers = res.data.data || [];

      const bankFiltered = allOffers.filter((offer) =>
        userCardMap[normalizeBankName(offer.bank)]
      );

      const finalOffers = bankFiltered.filter((offer) => {
        const offerBank = normalizeBankName(offer.bank);
        const offerCardNames = offer.cardNames || [];
        const userCardNames = userCardMap[offerBank];

        if (!userCardNames) return false;

        if (!Array.isArray(offerCardNames) || offerCardNames.length === 0) {
          return true;
        }

        return Array.from(userCardNames).some((userCardName) =>
          offerCardNames.includes(userCardName)
        );
      });

      setOffers(finalOffers);
    } catch (error) {
      console.error("❌ Error in fetchAllOffers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    const next = !showMatched;
    setShowMatched(next);
    next ? fetchMatchedOffers() : fetchAllOffers();
  };

  const handleOpenModal = (offerId) => {
    setSelectedOfferId(offerId);
    setShowModal(true);
  };

  useEffect(() => {
    const init = async () => {
      const cards = await fetchUserCards();
      if (cards.length > 0) {
        fetchMatchedOffers(cards);
      } else {
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

      <ScrollView contentContainerStyle={styles.grid}>
        {offers.map((item) => (
          <View key={item._id} style={styles.offerCard}>
            <Image
              source={{ uri: item.image || require("../../assets/banks/sbi.png") }}
              style={styles.offerImage}
              resizeMode="cover"
            />
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerBenefit} numberOfLines={2}>
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

            {/* ✅ View Details inside modal */}
            <TouchableOpacity onPress={() => handleOpenModal(item._id)}>
              <Text style={styles.offerLink}>View Details →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* ✅ Offer Modal */}
      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <ScrollView style={{ padding: 16, backgroundColor: "#fff" }}>
          <TouchableOpacity onPress={() => setShowModal(false)} style={{ marginBottom: 12 }}>
            <Text style={{ color: "#3D5CFF", fontWeight: "bold" }}>← Close</Text>
          </TouchableOpacity>
          {selectedOfferId && <OfferDetails offerId={selectedOfferId} />}
        </ScrollView>
      </Modal>
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
