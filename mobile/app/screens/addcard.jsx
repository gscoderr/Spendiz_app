import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import api from "../../utils/axiosInstance.js";
import { Ionicons } from "@expo/vector-icons";
import SelectBankModal from "./select_bank.jsx";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";

export default function AddCard() {
  const router = useRouter();
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

  const popularBanks = [
    "HDFC Bank", "SBI", "ICICI", "AXIS", "KOTAK", "RBL", "INDUSIND", "IDFC"
  ];

  // 🔁 Fetch all banks from backend
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await api.get(`/cards/banks`);
        console.log("✅ Banks from backend:", res.data);
        setAllBanks(res.data);
      } catch (err) {
        console.error("❌ Error fetching banks:", err?.response?.data || err.message);
        Alert.alert("Error", "Failed to fetch banks");
      }
    };
    fetchBanks();
  }, []);

  // 🔁 Fetch card names for selected bank
  useEffect(() => {
    const fetchCardNames = async () => {
      if (bank && allBanks.includes(bank)) {
        try {
          const res = await api.get(`/cards/card-names`, { params: { bank } });

          if (res.data.length === 0) {
            Alert.alert("No Cards", `No cards found for ${bank}`);
          }
          const items = res.data.map((card) => ({
            label: card,
            value: card
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

  // 🔁 Fetch network/tier on card name selection
  useEffect(() => {
    const fetchCardDetails = async () => {
      if (bank && cardName && allBanks.includes(bank)) {
        try {
          const res = await api.get(`/cards/card-details`, { params: { bank, cardName } });
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
      const res = await api.post(`/cards/add`, {
        bank,
        cardName,
        network,
        tier,
        last4Digits,
        cardHolderName,
      });

      if (res.data.success) {
        Alert.alert("Success", "Card added successfully");
        setBank("");
        setCardName(null);
        setNetwork("");
        setTier("");
        setCardHolderName("");
        setLast4Digits("");
        router.replace("/dashboard");
      } else {
        Alert.alert("Error", res.data.message || "Failed to add card");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to save card");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

         <Text style={styles.label}>Select Bank</Text>
          <TouchableOpacity onPress={() => setShowBankModal(true)} style={styles.dropdown}>
            <Text>{bank || "Tap to select your bank"}</Text>
          </TouchableOpacity>


        {/* 🚫 Move DropDownPicker OUTSIDE scroll to avoid nesting issue */}
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
          disabled={!allBanks.includes(bank)}
        />

        {/* ✅ All scrollable content should go inside KeyboardAwareScrollView */}
        <KeyboardAwareScrollView
          enableOnAndroid
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom:3 }}
        >
         
          {/* All inputs */}
          <Text style={styles.label}>Network</Text>
          <TextInput
            placeholder="Network"
            value={network}
            editable={false}
            style={[styles.input, { backgroundColor: "#eee" }]}
          />

          <Text style={styles.label}>Tier</Text>
          <TextInput
            placeholder="Tier"
            value={tier}
            editable={false}
            style={[styles.input, { backgroundColor: "#eee" }]}
          />

          <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            placeholder="Card Holder Name"
            value={cardHolderName}
            onChangeText={setCardHolderName}
            style={styles.input}
          />

          <Text style={styles.label}>Card digit</Text>
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
        </KeyboardAwareScrollView>

        {/* Modal */}
        <SelectBankModal
          visible={showBankModal}
          onClose={() => setShowBankModal(false)}
          onSelect={(selectedBank) => {
            if (allBanks.includes(selectedBank)) {
              setBank(selectedBank);
              setCardName(null);
              setNetwork("");
              setTier("");
            } else {
              Alert.alert("Coming Soon!", `We're working to add ${selectedBank} soon.`);
            }
            setShowBankModal(false);
          }}
          otherBanks={popularBanks.filter((b) => !allBanks.includes(b))}
        />
      </View>
    </KeyboardAvoidingView>


  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#0D0D2B", flex: 1, paddingTop: 60 },
  backBtn: { marginBottom: 16, alignSelf: "flex-start" },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 5, color: "#fff" },
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
