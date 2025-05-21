import React, { useEffect, useState } from "react";
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
  Keyboard,
  KeyboardAvoidingView,
  Animated,
  Easing,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../../utils/axiosInstance.js";
import TopBar from "../component/topbar.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function CreditCards() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState("A-Z Bank (Default)");
  const [longPressedCardId, setLongPressedCardId] = useState(null);

  const fadeAnim = useState(new Animated.Value(0))[0];

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
    const filtered = cards.filter(
      (card) =>
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
      setCards((prev) => prev.filter((c) => c._id !== cardId));
      setLongPressedCardId(null);
      Alert.alert("Deleted", "Card removed successfully");
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
      Alert.alert("Error", "Failed to delete card");
    }
  };

  const handleScroll = () => {
    if (sortModalVisible) setSortModalVisible(false);
  };

  const openSortModal = () => {
    setSortModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const closeSortModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSortModalVisible(false);
    });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D0D2B" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <TopBar
            screen="Credit"
            onFilterPress={openSortModal}
            onSearchPress={() => setSearchQuery("")}
          />
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={18}
              color="#888"
              style={{ marginRight: 6 }}
            />
            <TextInput
              placeholder="Search card or bank..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>

          <ScrollView
            style={styles.container}
            scrollEnabled={!sortModalVisible}
            onScrollBeginDrag={handleScroll}
          >
            <View style={styles.cardsHeader}>
              <Text style={styles.sectionTitle}>
                Your cards{" "}
                <Text style={styles.badge}>{filteredCards.length}</Text>
              </Text>
              <TouchableOpacity onPress={() => router.push("/screens/addcard")}>
                <Text style={styles.addCardLink}>+ Add card</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator color="#000" size="large" />
            ) : filteredCards.length === 0 ? (
              <Text
                style={{ color: "#888", textAlign: "center", marginTop: 20 }}
              >
                No matching cards found.
              </Text>
            ) : (
              filteredCards.map((card) => {
                const isLongPressed = longPressedCardId === card._id;
                return (
                  <TouchableOpacity
                    key={card._id}
                    onLongPress={() => setLongPressedCardId(card._id)}
                    delayLongPress={800}
                  >
                    <View style={{ position: "relative" }}>
                      <View style={styles.cardBox}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardBank}>{card.bank} Bank</Text>
                          <Text style={styles.cardName}>{card.cardName}</Text>
                        </View>

                        {/* <View style={styles.chip} /> */}
                        <LinearGradient
                          colors={["#d9d9d9", "#a1a1a1", "#e6e6e6"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.cardChip}
                        />

                        <View style={styles.cardNumber}>
                          <Text style={styles.dots}>•••• •••• ••••</Text>
                          <Text style={styles.lastDigits}>
                            {card.last4Digits || "0000"}
                          </Text>
                        </View>

                        <Text style={styles.cardHolder}>
                          {card.cardHolderName || "Your Name"}
                        </Text>
                        <View style={styles.networkLogoWrapper}>
                          <Image
                            source={
                              card.network?.toLowerCase() === "visa"
                                ? require("../../assets/banks/visa_sign.png")
                                : require("../../assets/banks/master_card.png")
                            }
                            style={styles.networkLogo}
                            resizeMode="contain"
                          />
                        </View>
                      </View>

                      {longPressedCardId === card._id && (
                        <View style={styles.backdrop}>
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
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            <View style={styles.featuresRow}>
              <Feature label="Offers & Benefits" icon="pricetags-outline" />
              <Feature label="Earn Rewards" icon="gift-outline" />
              <Feature label="Settings" icon="settings-outline" />
            </View>

            <TouchableOpacity style={styles.redemptionBox}>
              <Text style={styles.redemptionText}>
                🎁 Check redemption options
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {sortModalVisible && (
            <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
              <TouchableWithoutFeedback onPress={closeSortModal}>
                <View style={{ flex: 1 }}>
                  <TouchableWithoutFeedback>
                    <Animated.View style={styles.popupMenu}>
                      <Text style={styles.popupTitle}>Sort By</Text>
                      {[
                        "Reward Points",
                        "Due Date",
                        "Total Due Amount",
                        "A-Z Bank (Default)",
                        "A-Z Card Name",
                      ].map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => {
                            setSortOption(option);
                            closeSortModal();
                          }}
                          style={styles.popupOption}
                        >
                          <Text
                            style={[
                              styles.popupOptionText,
                              option === sortOption && {
                                color: "#3D5CFF",
                                fontWeight: "700",
                              },
                            ]}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  cardsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
  badge: { color: "#000", paddingHorizontal: 6, borderRadius: 8 },
  addCardLink: { color: "#000", fontWeight: "600" },
  cardBox: {
    backgroundColor: "#2f2f4f",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: { color: "#fff", fontSize: 16, marginBottom: 4 },
  cardSub: { color: "#ccc", fontSize: 14 },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  billText: { color: "#fff" },
  payNowBtn: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  payNowText: { color: "#000", fontWeight: "600" },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  feature: { alignItems: "center" },
  featureLabel: { fontSize: 12, marginTop: 4, color: "#000" },
  redemptionBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  redemptionText: { fontWeight: "600", color: "#000" },
  blurredCard: { backgroundColor: "#1E1E3F99", position: "relative" },

  popupMenu: {
    position: "absolute",
    top: 60, // ⬅️ pushes it below TopBar and SearchBar
    right: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    elevation: 10,
    width: 220,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  popupTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  popupOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  popupOptionText: {
    fontSize: 16,
    color: "#000",
  },

  cardBox: {
    backgroundColor: "#1B3C73", // solid rich blue
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: "100%",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  cardBank: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  cardName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  cardChip: {
  width: 48,
  height: 32,
  borderRadius: 6,
  marginBottom: 20,
  elevation: 4, // for subtle shadow on Android
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},

  cardNumber: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  dots: {
    color: "#ffffff",
    fontSize: 18,
    marginRight: 10,
  },

  lastDigits: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  cardHolder: {
    color: "#ffffffaa",
    fontSize: 14,
  },

  // reuse your existing backdrop + overlay styles:
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  actionOverlay: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 10,
  },

  // 👇 Overlay & Button Styles

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    borderRadius: 12,
  },

  actionOverlay: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 10,
  },

  deleteBtn: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cancelBtn: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },

  cancelText: {
    color: "#000",
    fontWeight: "600",
  },
  networkLogoWrapper: {
    position: "absolute",
    bottom: 5,
    right: 7,
  },

  networkLogo: {
    width: 90,
    height: 50,
  },
});
