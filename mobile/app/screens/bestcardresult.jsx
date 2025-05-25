import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { useBestCard } from "../../context/bestcard.context";
import { useLocalSearchParams } from "expo-router";
import SavedCard from "../component/savedcard.jsx";

export default function CardBenefitsScreen() {
  const { bestCards } = useBestCard();
  const params = useLocalSearchParams();
  const [suggestions, setSuggestions] = useState([]);

  console.debug("📦 bestCards loaded in screen:", bestCards);
  console.debug("📨 suggestions param received:", params?.suggestions);

  console.debug("🧾 Rendering bestCards:");

  useEffect(() => {
    if (params?.suggestions) {
      try {
        console.debug("📨 Parsing suggestions:", params.suggestions);
        setSuggestions(JSON.parse(params.suggestions));
      } catch (err) {
        console.warn("❌ Failed to parse suggestions", err);
      }
    }
  }, []);

  if ((!bestCards || bestCards.length === 0) && suggestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No cards matched.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {bestCards?.length > 0 && (
          <Text style={styles.sectionTitle}>BENEFITS OF YOUR CARD</Text>
        )}

        {bestCards.map((card, index) => (
          <View key={index} style={{ marginBottom: 28 }}>
            {/* CARD UI */}
            <SavedCard
              card={{
                bankName: card.bank,
                cardName: card.cardName,
                network: card.network,
                tier: card.tier,
                cardHolderName: card.cardHolderName, // ✅ user's actual name
                last4Digits: card.last4Digits, // ✅ user's actual last 4 digits
              }}
            />

            {/* AMOUNT BENEFIT BOX */}
            <View style={styles.amountBox}>
              <Text style={styles.amount}>
                ₹{card.benefitValue?.toFixed(2)}
              </Text>
              <Text style={styles.amountDesc}>
                Earned via{" "}
                {card.rewardType === "cashback" ? "Cashback" : "Reward Points"}
              </Text>
            </View>

            {/* OFFER SECTION */}
            <View style={styles.offerCard}>
              <View style={styles.offerLeft}>
                <View style={styles.circleLogo} />
                <View>
                  <Text style={styles.offerTitle}>
                    {Array.isArray(card.coPartnerBrands)
                      ? card.coPartnerBrands.join(", ")
                      : card.coPartnerBrands || "Partner Offer"}
                  </Text>
                  <Text style={styles.offerDescription}>
                    {card.benefitDetails || "Benefit details not available"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text style={styles.redeemBtn}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* SUGGESTIONS SECTION */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionTitle}>
              💡 Suggestions You May Like:
            </Text>
            {suggestions.map((s, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>
                  {s.cardName} — {s.bank}
                </Text>
                <Text style={styles.suggestionSub}>
                  {s.spendCategory} → {s.subCategory}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
  },
  amountBox: {
    backgroundColor: "#0f2344",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  amount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  amountDesc: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
  },
  offerCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  offerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  circleLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  offerTitle: {
    fontWeight: "600",
    fontSize: 15,
  },
  offerDescription: {
    color: "#777",
    fontSize: 12,
  },
  redeemBtn: {
    color: "#0057E7",
    fontWeight: "bold",
    paddingLeft: 12,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
    color: "#777",
  },
  suggestionBox: {
    backgroundColor: "#1F1F35",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  suggestionTitle: {
    color: "#00FFC2",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  suggestionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  suggestionSub: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
});
