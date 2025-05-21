import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "../component/topbar";

export default function BestCardResult() {
  const router = useRouter();

  const {
    cardName,
    bank,
    rewardType,
    benefitValue,
    cashback,
    rewardRate,
    subCategory,
    category,
    loungeAccess,
    fuelBenefit,
    milestone,
    otherPerks,
    tnc,
    remarks,
  } = useLocalSearchParams();

  const title = `${cardName} - ${bank}`;
  const formattedCategory =
    category?.charAt(0).toUpperCase() + category?.slice(1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D2B" />
      <TopBar screen={formattedCategory} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultTitle}>🎉 Best Card for {subCategory}</Text>

        <View style={styles.cardBox}>
          <Text style={styles.cardName}>{title}</Text>
          <Text style={styles.benefit}>
            Estimated Benefit:{" "}
            <Text style={styles.benefitValue}>₹{benefitValue}</Text>
          </Text>

          <View style={styles.breakdownBox}>
            <Text style={styles.breakdownLabel}>Reward Summary:</Text>
            {rewardType === "cashback" && (
              <Text style={styles.breakdownText}>Cashback: {cashback}%</Text>
            )}
            {rewardType === "reward" && (
              <Text style={styles.breakdownText}>Reward Rate: {rewardRate}%</Text>
            )}
            {remarks && <Text style={styles.breakdownText}>Remarks: {remarks}</Text>}
          </View>

          {loungeAccess && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lounge Access</Text>
              <Text style={styles.sectionText}>{loungeAccess}</Text>
            </View>
          )}

          {fuelBenefit && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fuel Benefit</Text>
              <Text style={styles.sectionText}>{fuelBenefit}</Text>
            </View>
          )}

          {milestone && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Milestone Benefits</Text>
              <Text style={styles.sectionText}>{milestone}</Text>
            </View>
          )}

          {otherPerks && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Other Perks</Text>
              <Text style={styles.sectionText}>{otherPerks}</Text>
            </View>
          )}

          {tnc && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Terms & Conditions</Text>
              <Text style={styles.sectionText}>{tnc}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={() => router.replace("/dashboard")}>
          <Text style={styles.doneText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D2B" },
  content: { padding: 20 },
  resultTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  cardBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  cardName: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 10 },
  benefit: { fontSize: 16, color: "#666" },
  benefitValue: { fontSize: 18, fontWeight: "bold", color: "#6A5AE0" },
  breakdownBox: { marginTop: 16 },
  breakdownLabel: { fontWeight: "600", fontSize: 14, marginBottom: 4, color: "#444" },
  breakdownText: { fontSize: 14, color: "#666", marginBottom: 4 },

  section: { marginTop: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#444", marginBottom: 4 },
  sectionText: { fontSize: 14, color: "#666" },

  doneButton: {
    backgroundColor: "#6A5AE0",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  doneText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
