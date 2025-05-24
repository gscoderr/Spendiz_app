import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';

const popularBanks = [
  { name: 'HDFC', icon: require('../../assets/banks/hdfc.png') },
  { name: 'SBI', icon: require('../../assets/banks/sbi.png') },
  { name: 'ICICI', icon: require('../../assets/banks/icici.png') },
  { name: 'AXIS', icon: require('../../assets/banks/axis.png') },
  { name: 'KOTAK', icon: require('../../assets/banks/kotak.png') },
  { name: 'RBL', icon: require('../../assets/banks/rbl.png') },
  { name: 'INDUSIND', icon: require('../../assets/banks/indusind.png') },
  { name: 'IDFC', icon: require('../../assets/banks/idfc.png') },
];

const otherBanks = [
  { name: 'YES BANK', icon: require('../../assets/banks/yes_bank.png') },
  { name: 'AMEX', icon: require('../../assets/banks/amex.png') },
  { name: 'SCB', icon: require('../../assets/banks/SCB.png') },
  { name: 'FEDERAL BANK', icon: require('../../assets/banks/federal_bank.jpeg') },
  { name: 'BANK OF BARODA', icon: require('../../assets/banks/federal_bank.jpeg') },
  { name: 'CITI BANK', icon: require('../../assets/banks/federal_bank.jpeg') },
  // Add more as needed CITI BANK
];

export default function SelectBankModal({ visible, onClose, onSelect }) {
  const [search, setSearch] = useState('');
  const [filteredBanks, setFilteredBanks] = useState(otherBanks);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredBanks(otherBanks);
    } else {
      const filtered = otherBanks.filter((bank) =>
        bank.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBanks(filtered);
    }
  }, [search]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Select Your Bank</Text>

          {/* 🔍 Search Input */}
          <TextInput
            placeholder="Search bank..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <Text style={styles.sectionLabel}>POPULAR BANKS</Text>
          <View style={styles.grid}>
            {popularBanks.map((bank, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bankIcon}
                onPress={() => {
                  onSelect(bank.name);
                  onClose();
                }}
              >
                <Image source={bank.icon} style={styles.bankLogo} />
                <Text style={styles.bankText}>{bank.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>OTHER BANKS</Text>
          <FlatList
            data={filteredBanks}
            keyExtractor={(item) => item.name}
            style={styles.otherList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.otherBankItem}
                onPress={() => {
                  onSelect(item.name);
                  onClose();
                }}
              >
                <Image source={item.icon} style={styles.otherBankLogo} />
                <Text style={styles.otherBankText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: 'rgba(0,0,0,0.3)' ,
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  closeBtn: { alignSelf: 'flex-end' },
  closeText: { fontSize: 20 },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionLabel: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bankIcon: {
    alignItems: 'center',
    margin: 10,
    width: 60,
  },
  bankLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  bankText: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  otherList: {
    marginTop: 10,
  },
  otherBankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  otherBankLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: 'contain',
  },
  otherBankText: {
    fontSize: 16,
  },
});
