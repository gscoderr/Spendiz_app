import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native-expo-image-cache"; // ✅ Lazy loading

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
      // default:  
        // return require("../../assets/banks/default.png");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.bankName}>{card?.bankName}</Text>
        <Text style={styles.cardName}>{card?.cardName}</Text>
      </View>

      <View style={styles.chip} />
      <Text style={styles.cardNumber}>•••• •••• •••• {card?.last4Digits}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.cardHolder}>Your Name</Text>
        <Image
          style={styles.logo}
          preview={{ uri: "" }} // placeholder (optional)
          uri=""
          {...getCardLogo(card?.network)} // ✅ fallback for local require
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1BC6B4",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bankName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  chip: {
    width: 40,
    height: 28,
    backgroundColor: "#ccc",
    borderRadius: 6,
    marginTop: 20,
  },
  cardNumber: {
    marginTop: 20,
    color: "#fff",
    fontSize: 20,
    letterSpacing: 2,
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
  },
  logo: {
    width: 40,
    height: 24,
    resizeMode: "contain",
  },
});
