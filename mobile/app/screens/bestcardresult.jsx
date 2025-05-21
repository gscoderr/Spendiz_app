import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import SavedCard from '../component/savedcard.jsx';
import { useBestCard } from '../../context/bestcard.context.js';
import { useLocalSearchParams } from 'expo-router';

export default function CardBenefitsScreen() {
  const { bestCards } = useBestCard();
  const params = useLocalSearchParams();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (params?.suggestions) {
      try {
        setSuggestions(JSON.parse(params.suggestions));
      } catch (err) {
        console.warn("❌ Failed to parse suggestions", err);
      }
    }
  }, []);

  if (!bestCards || bestCards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No cards matched.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>TOP BENEFITS FOR YOUR SPEND</Text>

        {bestCards.map((card, index) => (
          <View key={index} style={{ marginBottom: 24 }}>
            <SavedCard
              card={{
                bankName: card.bank,
                cardName: card.cardName,
                network: card.network,
                tier: card.tier,
                last4Digits: "XXXX",
              }}
            />
            <View style={styles.benefitSection}>
              <Text style={styles.amount}>₹{card.benefitValue?.toFixed(2)}</Text>
              <Text style={styles.amountDesc}>
                Earned via {card.rewardType === "cashback" ? "cashback" : "rewards"}
              </Text>
            </View>

            <View style={styles.offerCard}>
              <View style={styles.offerLeft}>
                <View style={styles.circleLogo} />
                <View>
                  <Text style={styles.offerTitle}>
                    {card.coPartnerBrands || "Offer"}
                  </Text>
                  <Text style={styles.offerDescription}>
                    {card.benefitDetails}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text style={styles.redeemBtn}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* ✅ Suggestions shown only when no bestCard matched */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionTitle}>💡 Suggestions You May Like:</Text>
            {suggestions.map((s, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>{s.cardName} — {s.bank}</Text>
                <Text style={styles.suggestionSub}>{s.spendCategory} → {s.subCategory}</Text>
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
    backgroundColor: '#F7F9FB',
  },
  container: {
    padding: 16,
  },
  benefitSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0CA789',
  },
  amountDesc: {
    color: '#666',
    marginTop: 4,
  },
  offerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  offerTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  offerDescription: {
    color: '#555',
    fontSize: 12,
  },
  redeemBtn: {
    color: '#0057E7',
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
    color: '#777',
  },
  suggestionBox: {
    backgroundColor: '#1F1F35',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  suggestionTitle: {
    color: '#00FFC2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionSub: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
});
