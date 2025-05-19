// 📁 File: app/(tabs)/creditcards.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../utils/axiosInstance.js';
import TopBar from '../component/topbar.jsx';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreditCards() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState("A-Z Bank (Default)");
  const [longPressedCardId, setLongPressedCardId] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.get("/cards/user");
        setCards(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching cards:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    const filtered = cards.filter(card =>
      card.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.bank.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sorted = [...filtered];
    switch (sortOption) {
      case "A-Z Card Name":
        sorted.sort((a, b) => a.cardName.localeCompare(b.cardName));
        break;
      case "Reward Points":
        sorted.sort((a, b) => (b.rewardPoints || 0) - (a.rewardPoints || 0));
        break;
      case "Due Date":
        sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case "Total Due Amount":
        sorted.sort((a, b) => (b.dueAmount || 0) - (a.dueAmount || 0));
        break;
      default:
        sorted.sort((a, b) => a.bank.localeCompare(b.bank));
    }
    setFilteredCards(sorted);
  }, [cards, searchQuery, sortOption]);

  const handleDelete = async (cardId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      setCards(prev => prev.filter(c => c._id !== cardId));
      setLongPressedCardId(null);
      Alert.alert("Deleted", "Card removed successfully");
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
      Alert.alert("Error", "Failed to delete card");
    }
  };

  function Feature({ label, icon }) {
    return (
      <TouchableOpacity style={styles.feature}>
        <Ionicons name={icon} size={22} color="#000" />
        <Text style={styles.featureLabel}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0D2B' }}>
      <TopBar
        screen="Credit"
        onFilterPress={() => setSortModalVisible(true)}
        onSearchPress={() => setSearchQuery("")}
      />

      <ScrollView style={styles.container}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search card or bank..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.cardsHeader}>
          <Text style={styles.sectionTitle}>Your cards <Text style={styles.badge}>{filteredCards.length}</Text></Text>
          <TouchableOpacity onPress={() => router.push("/screens/addcard")}> <Text style={styles.addCardLink}>+ Add card</Text></TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#000" size="large" />
        ) : filteredCards.length === 0 ? (
          <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>No matching cards found.</Text>
        ) : (
          filteredCards.map(card => {
            const isLongPressed = longPressedCardId === card._id;
            return (
              <TouchableOpacity
                key={card._id}
                onLongPress={() => setLongPressedCardId(card._id)}
                delayLongPress={1500}
              >
                <View style={[styles.cardBox, isLongPressed && styles.blurredCard]}>
                  {!isLongPressed ? (
                    <>
                      <Text style={styles.cardTitle}>{card.bank}</Text>
                      <Text style={styles.cardSub}>{card.cardName}</Text>
                      <View style={styles.billRow}>
                        <Text style={styles.billText}>🧾 Bill pending for this card?</Text>
                        <TouchableOpacity style={styles.payNowBtn}><Text style={styles.payNowText}>Pay Now</Text></TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <View style={styles.actionOverlay}>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(card._id)}>
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => setLongPressedCardId(null)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.featuresRow}>
          <Feature label="Offers & Benefits" icon="percent-outline" />
          <Feature label="Earn Rewards" icon="gift-outline" />
          <Feature label="Settings" icon="settings-outline" />
        </View>

        <TouchableOpacity style={styles.redemptionBox}>
          <Text style={styles.redemptionText}>🎁 Check redemption options</Text>
        </TouchableOpacity>

        {sortModalVisible && (
  <View style={StyleSheet.absoluteFillObject}>
    <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.popupMenu}>
            <Text style={styles.popupTitle}>Sort By</Text>
            {[
              "Reward Points",
              "Due Date",
              "Total Due Amount",
              "A-Z Bank (Default)",
              "A-Z Card Name"
            ].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSortOption(option);
                  setSortModalVisible(false);
                }}
                style={styles.popupOption}
              >
                <Text style={[
                  styles.popupOptionText,
                  option === sortOption && { color: "#3D5CFF", fontWeight: "700" }
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </View>
)}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
},

popupMenu: {
  position: 'absolute',
  top: 60, // adjust as needed (below TopBar)
  right: 16,
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 8,
  elevation: 8,
  width: 220,
  zIndex: 9999,
},

popupTitle: {
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#333',
},

popupOption: {
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

popupOptionText: {
  fontSize: 16,
  color: '#000',
},

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  cardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  badge: { color: '#000', paddingHorizontal: 6, borderRadius: 8 },
  addCardLink: { color: '#000', fontWeight: '600' },
  cardBox: { backgroundColor: '#2f2f4f', padding: 20, borderRadius: 16, marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 16, marginBottom: 4 },
  cardSub: { color: '#ccc', fontSize: 14 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center' },
  billText: { color: '#fff' },
  payNowBtn: { backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  payNowText: { color: '#000', fontWeight: '600' },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  feature: { alignItems: 'center' },
  featureLabel: { fontSize: 12, marginTop: 4 },
  redemptionBox: { marginTop: 20, padding: 12, borderRadius: 10, backgroundColor: '#fff' },
  redemptionText: { fontWeight: '600', color: '#000' },
  sortModal: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, elevation: 10 },
  sortHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sortTitle: { fontWeight: '700', fontSize: 14, color: '#888' },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.6, borderBottomColor: '#eee' },
  optionText: { fontSize: 16, color: '#000' },
  blurredCard: { backgroundColor: '#1E1E3F99', position: 'relative' },
  actionOverlay: { position: 'absolute', top: 20, left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  deleteBtn: { backgroundColor: 'red', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginBottom: 10 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#ccc', paddingVertical: 6, paddingHorizontal: 18, borderRadius: 20 },
  cancelText: { color: '#000', fontWeight: '600' },
});
