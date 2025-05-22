import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function SavedCard({ card }) {
  if (!card) return null;

  const getCardLogo = (network) => {
    const name = network?.toLowerCase();
    switch (name) {
      case "mastercard":
        return require("../../assets/banks/master_card.png");
      case "visa":
        return require("../../assets/banks/visa_sign.png");
      case "rupay":
        return require("../../assets/banks/rupay.png");
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      {/* Top row - Bank & Card Name */}
      <View style={styles.row}>
        <Text style={styles.bankName}>{card?.bankName}</Text>
        <Text style={styles.cardName}>{card?.cardName}</Text>
      </View>

      {/* Chip */}
      <View style={styles.chip} />

      {/* Card Number */}
      <Text style={styles.cardNumber}>•••• •••• •••• {card?.last4Digits}</Text>

      {/* Bottom row - Holder Name & Logo */}
      <View style={styles.bottomRow}>
        <Text style={styles.cardHolder}>{card?.cardHolderName || "Cardholder"}</Text>
        {card?.network && (
          <Image source={getCardLogo(card.network)} style={styles.logo} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0E1D59", // deep navy blue
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cardName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: "#cccccc",
    borderRadius: 6,
    marginTop: 24,
    marginBottom: 16,
  },
  cardNumber: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: "500",
  },
  bottomRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHolder: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
  },
  logo: {
    width: 40,
    height: 28,
    resizeMode: "contain",
  },
});
