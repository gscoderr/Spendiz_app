import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";

import { useBestCard } from "../../context/bestcard.context.js";
import { useLocalSearchParams } from "expo-router";
import SavedCard from "../component/savedcard.jsx";
import { useUser } from "../../context/user.context.js";


export default function CardBenefitsScreen() {
  const { bestCards } = useBestCard();
  const { userSavedCards } = useUser();
  const params = useLocalSearchParams();
  const [suggestions, setSuggestions] = useState([]);
  const { flightLink, flightAmount, from, to, date } = useLocalSearchParams();

  useEffect(() => {
    if (params?.suggestions) {
      try {
        const parsed = JSON.parse(params.suggestions);
        setSuggestions(parsed);
      } catch (err) {
        console.warn("❌ Failed to parse suggestions", err);
        setSuggestions([]);
      }
    }
  }, []);

  // 🐞 Debug
  console.log("🟢 bestCards:", bestCards?.length);
  console.log("🟡 suggestions:", suggestions?.length);
  console.log("flight amount",flightAmount)
  console.log("flight link",flightLink)
  console.log("flight from",from)
  console.log("flight to",to)
  console.log("flight date",date)

  if ((!bestCards || bestCards.length === 0) && suggestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No cards matched.</Text>
      </View>
    );
  }

  const getUserCardInfo = (bank, cardName) =>
    userSavedCards.find(
      (c) => c.bank.toLowerCase() === bank.toLowerCase() &&
        c.cardName.toLowerCase() === cardName.toLowerCase()
    );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>BENEFITS OF YOUR CARD</Text>

        {bestCards?.length > 0 ? (
          bestCards.map((card, index) => {
            const userCard = getUserCardInfo(card.bank, card.cardName);
            const holderName =
              userCard?.cardHolderName || card.cardHolderName || "You";
            const last4 = userCard?.last4Digits || card.last4Digits || "0000";

            const totalBenefit = card.totalBenefitValue?.toFixed(2) || "0.00";
            const cashback = card.cashbackBenefitValue?.toFixed(2) || "0.00";
            const reward = card.rewardBenefitValue?.toFixed(2) || "0.00";

            return (
              <View key={index} style={{ marginBottom: 28 }}>
                <SavedCard
                  card={{
                    bankName: card.bank,
                    cardName: card.cardName,
                    network: card.network,
                    tier: card.tier,
                    cardHolderName: holderName,
                    last4Digits: last4,
                  }}
                />

                <View style={styles.amountBox}>
                  <Text style={styles.amount}>₹{totalBenefit}</Text>
                  <Text style={styles.amountDesc}>
                    Cashback: ₹{cashback} | Rewards: ₹{reward}
                  </Text>
                </View>

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
            );
          })
        ) : (
          <Text style={[styles.errorText, { marginBottom: 16 }]}>
            No matching cards found for this spend. Try checking offers below.
          </Text>
        )}

        {flightLink && (
          <View style={[styles.offerCard, { backgroundColor: '#e8f8f5' }]}>
            <View style={styles.offerLeft}>
              <View>
                <Text style={[styles.offerTitle, { fontSize: 16, color: '#1a5276' }]}>Flight Booking Available</Text>
                <Text style={[styles.offerDescription, { color: '#1a5276' }]}>From {from} to {to} on {date} at ₹{Number(flightAmount).toLocaleString("en-IN")}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(flightLink)}>
              <Text style={[styles.redeemBtn, { color: '#0e6655' }]}>Book Now →</Text>
            </TouchableOpacity>
          </View>
        )}

        {suggestions.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>💡 Other Offers You May Like</Text>
            {suggestions.map((offer, index) => (
              <View key={index} style={styles.offerCard}>
                <View style={styles.offerLeft}>
                  <View style={styles.circleLogo} />
                  <View>
                    <Text style={styles.offerTitle}>
                      {Array.isArray(offer.coPartnerBrands)
                        ? offer.coPartnerBrands.join(", ")
                        : offer.coPartnerBrands || "Partner Offer"}
                    </Text>
                    <Text style={styles.offerDescription}>
                      {offer.benefitDetails ||
                        `Get extra benefits on ${offer.subCategory || "spends"}`}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text style={styles.redeemBtn}>View</Text>
                </TouchableOpacity>
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
    paddingTop: 40,
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
});
