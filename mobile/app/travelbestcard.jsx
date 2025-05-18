import React, { useState } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert
} from "react-native";
import { useRoute } from "@react-navigation/native";

export default function BestCard() {
  const route = useRoute();
  const { category, subCategory } = route.params;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [persons, setPersons] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    if (!from || !to || !persons || !budget) {
      Alert.alert("Fill all fields", "Please complete all travel details.");
      return;
    }

    // Add matching logic here later
    Alert.alert(
      "Searching Cards",
      `From: ${from}\nTo: ${to}\nPersons: ${persons}\nBudget: ₹${budget}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        Plan your {subCategory} trip
      </Text>

      <TextInput
        placeholder="From"
        value={from}
        onChangeText={setFrom}
        style={styles.input}
      />
      <TextInput
        placeholder="To"
        value={to}
        onChangeText={setTo}
        style={styles.input}
      />
      <TextInput
        placeholder="No. of Persons"
        value={persons}
        onChangeText={setPersons}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Approx Budget (₹)"
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Best Card</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
