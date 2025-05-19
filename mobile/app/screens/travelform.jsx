// mobile/app/travelform.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TravelForm() {
  const navigation = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [persons, setPersons] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = () => {
    if (!from || !to || !persons || !budget) {
      alert('Please fill all fields');
      return;
    }

    navigation.navigate('travelbestcard', {
      from,
      to,
      persons: parseInt(persons),
      budget: parseFloat(budget)
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Travel Card Suggestion</Text>

      <TextInput
        style={styles.input}
        placeholder="From"
        value={from}
        onChangeText={setFrom}
      />
      <TextInput
        style={styles.input}
        placeholder="To"
        value={to}
        onChangeText={setTo}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Persons"
        value={persons}
        onChangeText={setPersons}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Approx. Budget (₹)"
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#6A5AE0',
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  }
});
 