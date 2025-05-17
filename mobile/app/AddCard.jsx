import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from "react-native";
import axios from '../utils/axiosInstance.js'
import { Ionicons } from "@expo/vector-icons";
import SelectBankModal from "./select_bank";
import DropDownPicker from "react-native-dropdown-picker";

export default function AddCard({ navigation }) {
  const [bank, setBank] = useState("");
  const [cardName, setCardName] = useState(null);
  const [network, setNetwork] = useState("");
  const [tier, setTier] = useState("");
  const [last4Digits, setLast4Digits] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);

  const [allBanks, setAllBanks] = useState([]);
  const [cardNameOptions, setCardNameOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const popularBanks = ["HDFC", "SBI", "ICICI", "AXIS", "KOTAK", "RBL", "INDUSIND", "IDFC"];

  // 🔁 Fetch all banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get(`/cards/bank`);
        setAllBanks(res.data);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch banks");
      }
    };
    fetchBanks();
  }, []);

  // 🔁 Fetch card names when bank is selected
  useEffect(() => {
  const fetchCardNames = async () => {
    if (bank) {
      try {
        const res = await axios.get(`/cards/card-names`, {
          params: { bank }
        });
        // 🔁 FIX: Convert string array into dropdown items
        const items = res.data.map((card) => ({
          label: card, // What you see
          value: card  // What gets saved
        }));
        setCardNameOptions(items);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch card names");
      }
    } else {
      setCardNameOptions([]);
    }
  };
  fetchCardNames();
}, [bank]);

  // 🔁 Fetch card details on selection
  useEffect(() => {
    const fetchCardDetails = async () => {
      if (bank && cardName) {
        try {
          const res = await axios.get(`/cards/card-details`, {
            params: { bank, cardName }
          });
          setNetwork(res.data.network || "");
          setTier(res.data.tier || "");
        } catch (err) {
          Alert.alert("Error", "Failed to fetch card details");
        }
      }
    };
    fetchCardDetails();
  }, [cardName]);

  const handleSave = async () => {
    if (!bank || !cardName || !network || !tier || !last4Digits || !cardHolderName) {
      return Alert.alert("Please fill all fields");
    }

    try {
      const res = await axios.post(`/cards/add`, {
        bank,
        cardName,
        network,
        tier,
        last4Digits,
        cardHolderName,
      });

      if (res.data.success) {
        Alert.alert("Success", "Card added successfully");
        setBank(""); setCardName(null); setNetwork(""); setTier("");
        setCardHolderName(""); setLast4Digits("");
      } else {
        Alert.alert("Error", res.data.message || "Failed to add card");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to save card");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Back Icon */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.label}>Select Bank</Text>
      <TouchableOpacity onPress={() => setShowBankModal(true)} style={styles.dropdown}>
        <Text>{bank || "Tap to select your bank"}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Select Card Name</Text>
      <DropDownPicker
        open={dropdownOpen}
        value={cardName}
        items={cardNameOptions}
        setOpen={setDropdownOpen}
        setValue={setCardName}
        setItems={setCardNameOptions}
        searchable={true}
        placeholder="Select card name"
        style={styles.dropdownPicker}
        dropDownContainerStyle={{ borderColor: '#ccc' }}
        zIndex={5000}
        zIndexInverse={1000}
      />

      <TextInput
        placeholder="Network"
        value={network}
        editable={false}
        style={styles.input}
      />
      <TextInput
        placeholder="Tier"
        value={tier}
        editable={false}
        style={styles.input}
      />
      <TextInput
        placeholder="Card Holder Name"
        value={cardHolderName}
        onChangeText={setCardHolderName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last 4 Digits"
        value={last4Digits}
        onChangeText={setLast4Digits}
        maxLength={4}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Card</Text>
      </TouchableOpacity>

      <SelectBankModal
        visible={showBankModal}
        onClose={() => setShowBankModal(false)}
        onSelect={(selectedBank) => {
          setBank(selectedBank);
          setCardName(null);
          setNetwork("");
          setTier("");
          setShowBankModal(false);
        }}
        otherBanks={allBanks.filter((b) => !popularBanks.includes(b))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f9f9f9" },
  backBtn: { marginBottom: 16, alignSelf: "flex-start" },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dropdownPicker: {
    borderColor: "#ccc",
    marginBottom: 10,
    zIndex: 5000,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
