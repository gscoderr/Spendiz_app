import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../utils/axiosInstance.js';

export default function CreditCards() {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
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


  const handleDelete = async (cardId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      setCards(prev => prev.filter(c => c._id !== cardId));
      setLongPressedCardId(null);
      Alert.alert("Success", "Card deleted");
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
    <ScrollView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Credit Cards</Text>
        <View style={styles.icons}>
          <Ionicons name="funnel-outline" size={20} color="#fff" style={styles.icon} />
          <Ionicons name="search" size={20} color="#fff" />
        </View>
      </View>

      {/* Alert Box */}
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>⚠️ You have 1 pending action</Text>
        <TouchableOpacity>
          <Text style={styles.alertView}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Box */}
      <View style={styles.summaryCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.amount}>₹0</Text>
            <Text style={styles.subText}>Total points 0</Text>
          </View>
          <TouchableOpacity>
            <FontAwesome name="star" size={24} color="#ffcc00" />
          </TouchableOpacity>
        </View>
        <View style={styles.dueBox}>
          <Text>Total Due: ₹0</Text>
          <Text>Unbilled spend: ₹0</Text>
        </View>
      </View>

      {/* Your Cards */}
      <View style={styles.cardsHeader}>
        <Text style={styles.sectionTitle}>
          Your cards <Text style={styles.badge}>{cards.length}</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('addcard')}>
          <Text style={styles.addCardLink}>+ Add card</Text>
        </TouchableOpacity>
      </View>

      {/* Card List */}
      {loading ? (
        <ActivityIndicator color="#000" size="large" />
      ) : cards.length === 0 ? (
        <Text style={{ color: "#666", textAlign: "center", marginTop: 20 }}>
          You haven't added any cards yet.
        </Text>
      ) : (
        cards.map((card, index) => {
          const isLongPressed = longPressedCardId === card._id;

          return (
            <TouchableOpacity
              key={card._id}
              onLongPress={() => setLongPressedCardId(card._id)}
              delayLongPress={2000} // 2 seconds
              activeOpacity={1}
            >
              <View key={index} style={[styles.cardBox, isLongPressed && styles.blurredCard]}>
                {!isLongPressed ? (
                  <>
                    <Text style={styles.cardTitle}>{card.bank}</Text>
                    <Text style={styles.cardSub}>{card.cardName}</Text>

                    <View style={styles.billRow}>
                      <Text style={styles.billText}>🧾 Bill pending for this card?</Text>
                      <TouchableOpacity style={styles.payNowBtn}>
                        <Text style={styles.payNowText}>Pay Now</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View style={styles.actionOverlay}>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(card._id)}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setLongPressedCardId(null)}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )
      }
      {/* ) : (
        cards.map((card, index) => (
          <View key={index} style={styles.cardBox}>
            <Text style={styles.cardTitle}>{card.bank}</Text>
            <Text style={styles.cardSub}>{card.cardName}</Text>

            <View style={styles.billRow}>
              <Text style={styles.billText}>🧾 Bill pending for this card?</Text>
              <TouchableOpacity style={styles.payNowBtn}>
                <Text style={styles.payNowText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )} */}


      {/* Feature Shortcuts */}
      <View style={styles.featuresRow}>
        <Feature label="Offers & Benefits" icon="percent-outline" />
        <Feature label="Earn Rewards" icon="gift-outline" />
        <Feature label="Settings" icon="settings-outline" />
      </View>

      <TouchableOpacity style={styles.redemptionBox}>
        <Text style={styles.redemptionText}>🎁 Check redemption options</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: {
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  icons: { flexDirection: 'row' },
  icon: { marginRight: 12 },

  alertBox: {
    backgroundColor: '#fff3cd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  alertText: { color: '#856404' },
  alertView: { color: '#007bff', fontWeight: '600' },

  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  amount: { fontSize: 22, fontWeight: 'bold' },
  subText: { color: '#666', marginTop: 4 },
  dueBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  cardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  badge: {

    color: '#000',
    paddingHorizontal: 6,
    borderRadius: 8,
    marginLeft: 6,
  },
  addCardLink: {
    color: '#000',
    fontWeight: '600',
  },

  cardBox: {
    backgroundColor: '#2f2f4f',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: { color: '#fff', fontSize: 16, marginBottom: 4 },
  cardSub: { color: '#ccc', fontSize: 14 },

  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  billText: { color: '#fff' },
  payNowBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  payNowText: { color: '#000', fontWeight: '600' },

  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  feature: { alignItems: 'center' },
  featureLabel: { fontSize: 12, marginTop: 4 },

  redemptionBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  redemptionText: {
    fontWeight: '600',
    color: '#000',
  },
  blurredCard: {
    backgroundColor: '#1E1E3F99', // add transparency
    position: 'relative',
  },

  actionOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  deleteBtn: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },

  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  cancelBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },

  cancelText: {
    color: '#000',
    fontWeight: '600',
  },
  blurredCard: {
  backgroundColor: '#1E1E3F99', // add transparency
  position: 'relative',
},

actionOverlay: {
  position: 'absolute',
  top: 20,
  left: 0,
  right: 0,
  alignItems: 'center',
  zIndex: 10,
},

deleteBtn: {
  backgroundColor: 'red',
  paddingVertical: 8,
  paddingHorizontal: 20,
  borderRadius: 20,
  marginBottom: 10,
},

deleteText: {
  color: '#fff',
  fontWeight: 'bold',
},

cancelBtn: {
  backgroundColor: '#ccc',
  paddingVertical: 6,
  paddingHorizontal: 18,
  borderRadius: 20,
},

cancelText: {
  color: '#000',
  fontWeight: '600',
},


});
