import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "../component/topbar";
import { useBestCard } from "../../context/bestcard.context";
import { useUser } from "../../context/user.context";
import api from "../../utils/axiosInstance";

export default function CategoryForm() {
  const { category, subCategory } = useLocalSearchParams();
  const formattedCategory =
    category?.charAt(0).toUpperCase() + category?.slice(1);
  const router = useRouter();
  const { setBestCard } = useBestCard();
  const { token } = useUser();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(""); // ✅ Added
  const [persons, setPersons] = useState("");
  const [budget, setBudget] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Full");
  const [movie, setMovie] = useState("");
  const [location, setLocation] = useState("");

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
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
            />
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

  const handleSubmit = async () => {
    try {
      let spendAmount = 0;

      if (category === "travel") {
        if (!from || !to || !persons || !budget) {
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
      if (isNaN(spendAmount) || spendAmount <= 0) {
        alert("Invalid amount.");
        return;
      }

      if (!token) {
        alert("Login session expired. Please login again.");
        return;
      }

      console.log("📤 Sending to API:", {
        category,
        subCategory,
        amount: spendAmount,
      });

      const res = await api.get("/match/best-card", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          category: category?.trim().toLowerCase(),
          subCategory: subCategory?.trim().toLowerCase(),
          amount: spendAmount,
        },
      });

      const { bestCards, suggestions, success } = res.data;

      if (success && bestCards?.length > 0) {
        setBestCard(bestCards);
        router.push("/screens/bestcardresult");
      } else if (suggestions?.length > 0) {
        router.push({
          pathname: "/screens/bestcardresult",
          params: {
            suggestions: JSON.stringify(suggestions),
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Get Best Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D2B",
    paddingTop: 40,
  },
  form: {
    padding: 20,
  },
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
});
