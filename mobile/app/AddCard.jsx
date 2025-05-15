import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';

export default function AddCard() {
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [network, setNetwork] = useState('');
  const [tier, setTier] = useState('');
  const [last4, setLast4] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // Fetch distinct banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get(`${API_URL}/mastercards/banks`);
        setBanks(res.data);
      } catch (error) {
        console.error('Error fetching banks:', error.message);
      }
    };
    fetchBanks();
  }, []);

  // Fetch cards when bank is selected
  useEffect(() => {
    const fetchCards = async () => {
      if (!selectedBank) return;
      try {
        const res = await axios.get(`${API_URL}/mastercards/cards?bank=${selectedBank}`);
        setCards(res.data);
      } catch (error) {
        console.error('Error fetching cards:', error.message);
      }
    };
    fetchCards();
  }, [selectedBank]);

  // Auto-fill Network and Tier
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedBank || !selectedCard) return;
      try {
        const res = await axios.get(
          `${API_URL}/mastercards/details?bank=${selectedBank}&cardName=${selectedCard}`
        );
        setNetwork(res.data.network || '');
        setTier(res.data.tier || '');
      } catch (error) {
        console.error('Error fetching card details:', error.message);
      }
    };
    fetchDetails();
  }, [selectedCard]);

  const handleSave = async () => {
    if (!selectedBank || !selectedCard || !last4) {
      alert('Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        bank: selectedBank,
        cardName: selectedCard,
        network,
        tier,
        last4,
      };

      const res = await axios.post(`${API_URL}/usercards/add`, payload);
      alert(res.data.message || 'Card added successfully!');
      setSelectedBank('');
      setSelectedCard('');
      setNetwork('');
      setTier('');
      setLast4('');
    } catch (error) {
      alert('Error saving card');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Credit Card</Text>

      {/* Bank Dropdown */}
      <Text style={styles.label}>Bank Name</Text>
      <View style={styles.dropdown}>
        {banks.map((bank) => (
          <TouchableOpacity key={bank} onPress={() => setSelectedBank(bank)}>
            <Text style={selectedBank === bank ? styles.selectedItem : styles.item}>{bank}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Card Dropdown */}
      {selectedBank ? (
        <>
          <Text style={styles.label}>Card Name</Text>
          <View style={styles.dropdown}>
            {cards.map((card) => (
              <TouchableOpacity key={card} onPress={() => setSelectedCard(card)}>
                <Text style={selectedCard === card ? styles.selectedItem : styles.item}>{card}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}

      {/* Auto-filled Fields */}
      {selectedCard ? (
        <>
          <Text style={styles.label}>Network</Text>
          <TextInput style={styles.input} value={network} editable={false} />

          <Text style={styles.label}>Tier</Text>
          <TextInput style={styles.input} value={tier} editable={false} />

          <Text style={styles.label}>Last 4 Digits</Text>
          <TextInput
            style={styles.input}
            value={last4}
            onChangeText={setLast4}
            placeholder="1234"
            keyboardType="numeric"
            maxLength={4}
          />
        </>
      ) : null}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Card</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9ff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  item: {
    padding: 10,
    color: '#333',
  },
  selectedItem: {
    padding: 10,
    color: '#3D5CFF',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#3D5CFF',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});
