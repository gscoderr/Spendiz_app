import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "../component/topbar";
import { useBestCard } from "../../context/bestcard.context.js";
import { useUser } from "../../context/user.context.js";
import api from "../../utils/axiosInstance.js";
import { fetchMatchingOffers } from "../../utils/offers.api.js";

export default function CategoryForm() {
  const { category, subCategory } = useLocalSearchParams();
  const formattedCategory =
    category?.charAt(0).toUpperCase() + category?.slice(1);
  const router = useRouter();
  const { setBestCard } = useBestCard();
  const { token, userSavedCards } = useUser();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [lowestPrice, setLowestPrice] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [persons, setPersons] = useState("");
  const [budget, setBudget] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Full");
  const [movie, setMovie] = useState("");
  const [location, setLocation] = useState("");
  const [deals, setDeals] = useState([]);
  const [flightLink, setFlightLink] = useState("");
  const [matchedOffers, setMatchedOffers] = useState([]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setDate(formatted);
    }
  };

  const fetchFlightDeals = async (from, to, date) => {
    try {
      const res = await api.get("/travel/flights", {
        params: { from, to, date },
      });
      return res.data?.data || [];
    } catch (err) {
      console.error("❌ Error fetching flights:", err?.message);
      return [];
    }
  };

  useEffect(() => {
    const valid =
      from.length === 3 && to.length === 3 && /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!valid) return;

    const delay = setTimeout(async () => {
      const flights = await fetchFlightDeals(
        from.toUpperCase(),
        to.toUpperCase(),
        date
      );
      setDeals(flights);

      if (flights.length > 0) {
        setLowestPrice(flights[0]?.price?.toString());
        setBudget(flights[0]?.price?.toString());
        setFlightLink("https://www.aviasales.com" + flights[0]?.link);
      }
    }, 800);

    return () => clearTimeout(delay);
  }, [from, to, date]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetchMatchingOffers({
          cards: userSavedCards,
          category: category?.trim().toLowerCase(),
          subCategory: subCategory?.trim().toLowerCase(),
        });

        setMatchedOffers(res || []);
        console.log("🎯 Matched Dynamic Offers:", res);
      } catch (err) {
        console.warn("❌ Offer fetch failed:", err.message);
      }
    };

    if (userSavedCards?.length > 0 && category && subCategory) {
      fetchOffers();
    }
  }, [category, subCategory]);

  const renderFields = () => {
    switch (category) {
      case "travel":
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="From (e.g. DEL)"
              value={from}
              onChangeText={setFrom}
            />
            <TextInput
              style={styles.input}
              placeholder="To (e.g. BOM)"
              value={to}
              onChangeText={setTo}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={styles.input}
                  placeholder="Select Date"
                  value={date}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Number of Persons"
              keyboardType="numeric"
              value={persons}
              onChangeText={setPersons}
            />
            <TextInput
              style={styles.input}
              placeholder="Approx. Budget (₹)"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
            />

            {deals.length > 0 && (
              <View style={styles.dealsBox}>
                <Text style={styles.dealsHeading}>Live Flight Prices</Text>
                <View style={[styles.dealRow, { marginBottom: 12 }]}>
                  <Text
                    style={[
                      styles.dealText,
                      { fontWeight: "bold", color: "#00FFAA" },
                    ]}
                  >
                    🟢 Current Lowest Price → ₹
                    {Number(deals[0]?.price).toLocaleString("en-IN")}
                  </Text>
                </View>
                {deals.slice(0, 3).map((deal, idx) => (
                  <View key={idx} style={styles.dealRow}>
                    <Text style={styles.dealText}>
                      ✈ {deal.origin} → {deal.destination} | ₹
                      {Number(deal.price).toLocaleString("en-IN")} |{" "}
                      {mapAirlineName(deal.airline)}
                    </Text>
                  </View>
                ))}
                {deals.length < 3 && (
                  <Text style={{ color: "yellow", marginTop: 6 }}>
                    ⚠️ Only {deals.length} flight deal(s) available.
                  </Text>
                )}
              </View>
            )}
          </>
        );
      case "entertainment":
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Movie/Event Name"
              value={movie}
              onChangeText={setMovie}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />
          </>
        );
      case "shopping":
      case "dining":
      default:
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Spend Amount (₹)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <View style={styles.modeToggle}>
              {["Full", "EMI"].map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.modeButton,
                    paymentMode === mode && styles.modeSelected,
                  ]}
                  onPress={() => setPaymentMode(mode)}
                >
                  <Text
                    style={[
                      styles.modeText,
                      paymentMode === mode && styles.modeTextSelected,
                    ]}
                  >
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
    }
  };

  const mapAirlineName = (code) => {
    const airlines = {
      "6E": "IndiGo",
      AI: "Air India",
      SG: "SpiceJet",
      UK: "Vistara",
      G8: "GoFirst",
      IX: "Air India Express",
      I5: "AirAsia India",
    };
    return airlines[code] || code;
  };

  const handleSubmit = async () => {
    try {
      let spendAmount = 0;

      if (category === "travel") {
        if (!from || !to || !date || !persons || !budget) {
          alert("Please fill all travel fields.");
          return;
        }
        spendAmount = parseFloat(budget);
      } else if (["shopping", "dining"].includes(category)) {
        if (!amount) {
          alert("Please enter spend amount.");
          return;
        }
        spendAmount = parseFloat(amount);
      } else if (category === "entertainment") {
        if (!movie || !location) {
          alert("Please enter movie name and location.");
          return;
        }
        spendAmount = 1000;
      }

      if (isNaN(spendAmount) || spendAmount <= 0) {
        alert("Invalid amount.");
        return;
      }

      if (!token) {
        alert("Login session expired. Please login again.");
        return;
      }

      const res = await api.get("/match/best-card", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          category: category?.trim().toLowerCase(),
          subCategory: subCategory?.trim().toLowerCase(),
          amount: spendAmount,
          from,
          to,
          date,
        },
      });

      const { bestCards, suggestions, success } = res.data;

      if (success && bestCards?.length > 0) {
        setBestCard(bestCards);
        router.push({
          pathname: "/screens/bestcardresult",
          params: {
            flightLink,
            flightAmount: lowestPrice,
            from,
            to,
            date,
          },
        });
      } else if (suggestions?.length > 0) {
        router.push({
          pathname: "/screens/bestcardresult",
          params: {
            suggestions: JSON.stringify(suggestions),
            flightLink,
            flightAmount: lowestPrice,
            from,
            to,
            date,
          },
        });
      } else {
        alert("No matching card found.");
      }
    } catch (err) {
      console.error("❌ Error:", err?.message);
      alert(err?.response?.data?.message || "Unable to find best card.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D2B" />
      <TopBar screen={formattedCategory} />
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{subCategory}</Text>
        {renderFields()}

        {/* ✅ Matched Offers Display */}
        {matchedOffers.length > 0 && (
          <View style={styles.dealsBox}>
            <Text style={styles.dealsHeading}>🔥 Bank Offers</Text>
            {matchedOffers.map((offer, idx) => (
              <View key={idx} style={styles.dealRow}>
                <Text style={styles.dealText}>
                  🏦 {offer.bank} → {offer.benefit}
                </Text>
                {offer.partnerBrands?.length > 0 && (
                  <Text style={styles.dealText}>
                    🎯 Brands: {offer.partnerBrands.join(", ")}
                  </Text>
                )}
                <Text style={styles.dealText}>
                  📅 Valid Till:{" "}
                  {new Date(offer.validTill).toDateString()}
                </Text>
                {offer.tnc && (
                  <Text style={[styles.dealText, { fontSize: 12, color: "#ccc" }]}>
                    📝 {offer.tnc}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Get Best Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D2B", paddingTop: 40 },
  form: { padding: 20 },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    textTransform: "capitalize",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  modeToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    marginHorizontal: 10,
  },
  modeSelected: {
    backgroundColor: "#6A5AE0",
  },
  modeText: {
    color: "#ccc",
    fontWeight: "600",
  },
  modeTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#6A5AE0",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dealsBox: {
    backgroundColor: "#1A1A3C",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  dealsHeading: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dealRow: {
    marginBottom: 6,
  },
  dealText: {
    color: "#fff",
    fontSize: 14,
  },
});
