import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import SavedCard from '../component/savedcard.jsx';

// 🧠 Dummy card data (replace with context later)
const sampleCard = {
  bankName: 'HDFC Bank',
  cardName: 'Millennia Credit Card',
  last4Digits: '5678',
  network: 'Mastercard',
};

export default function CardBenefitsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ SavedCard Component */}
        <SavedCard card={sampleCard} />

        {/* ✅ Benefit Summary */}
        <View style={styles.benefitSection}>
          <Text style={styles.sectionTitle}>BENEFITS OF YOUR CARD</Text>
          <View style={styles.amountBox}>
            <Text style={styles.amount}>₹2,000</Text>
            <Text style={styles.amountDesc}>Earned with your card</Text>
          </View>
        </View>

        {/* ✅ Co-Brand Offer */}
        <View style={styles.offerCard}>
          <View style={styles.offerLeft}>
            <View style={styles.circleLogo} />
            <View>
              <Text style={styles.offerTitle}>MakeMyTrip</Text>
              <Text style={styles.offerDescription}>
                5% Cashback on flight bookings
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.redeemBtn}>Redeem</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Co-Partner Offer */}
        <View style={styles.offerCard}>
          <View style={styles.offerLeft}>
            <View style={styles.circleLogo} />
            <View>
              <Text style={styles.offerTitle}>Amazon Pay</Text>
              <Text style={styles.offerDescription}>
                10% Cashback on shopping
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.redeemBtn}>Redeem</Text>
          </TouchableOpacity>
        </View>
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
  amountBox: {
    backgroundColor: '#0CA789',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  amountDesc: {
    color: '#fff',
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
});
 