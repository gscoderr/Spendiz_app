import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();
  const userName = 'Gog';
  const avatarInitials =
    userName.length === 1
      ? userName[0].toUpperCase()
      : (userName[0] + userName[userName.length - 1]).toUpperCase();

  return (
    <View style={styles.container}>
      {/* Top Greeting & Refer */}
      <View style={styles.topBar}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>
        <Text style={styles.greeting}>Hi {userName}</Text>
        <TouchableOpacity style={styles.referBtn}>
          <Text style={styles.referText}>Refer</Text>
        </TouchableOpacity>
        <FontAwesome name="bell" size={20} color="#fff" style={styles.bellIcon} />
      </View>

      {/* Scrollable Body */}
      <ScrollView contentContainerStyle={styles.bodyContainer}>
        {/* Pending Action */}
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>⚠️ You have 1 pending action </Text>
          <TouchableOpacity>
            <Text style={styles.viewLink}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Reward Points */}
        <View style={styles.rewardBox}>
          <Text style={styles.points}>0 Points</Text>
          <Text style={styles.subText}>Fetch your reward points</Text>
          <TouchableOpacity style={styles.gmailButton}>
            <Text style={styles.gmailText}>Connect Gmail</Text>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png' }}
              style={styles.gmailIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Your Cards */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Your Cards</Text>
          <TouchableOpacity style={styles.addCard} onPress={() => navigation.navigate('addcard')}>
            <Text style={styles.addIcon}>＋</Text>
            <Text style={styles.addText}>Add your cards to view rewards & offers</Text>
          </TouchableOpacity>
        </View>

        {/* Spend Analysis */}
        <View style={styles.spendBox}>
          <Text style={styles.sectionTitle}>Spend Analysis</Text>
          <Text style={styles.spendSub}>This Month</Text>
          <Text style={styles.spendAmount}>₹0</Text>
          <Text style={styles.breakupLink}>View Detailed Breakup</Text>
        </View>
      </ScrollView>

      {/* Ask Savvy Floating Button */}
      <TouchableOpacity style={styles.askSavvy}>
        <Text style={styles.askSavvyText}>Ask Savvy</Text>
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.tabActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Credit')}>
          <Text style={styles.tab}>Credit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Loyalty')}>
          <Text style={styles.tab}>Loyalty</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Consult')}>
          <Text style={styles.tab}>Consult</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // same styles as previous message
  container: { flex: 1, backgroundColor: '#0D0D2B' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#0D0D2B',
  },
  avatar: {
    backgroundColor: '#F2C6D1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#000', fontWeight: '700' },
  greeting: { color: '#fff', fontSize: 18, flex: 1 },
  referBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  referText: { fontWeight: '600', color: '#000' },
  bellIcon: { marginLeft: 12 },

  bodyContainer: {
    paddingBottom: 80,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#fff5e5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  alertText: { color: '#000', fontSize: 14 },
  viewLink: { color: '#3D5CFF', fontWeight: '600' },

  rewardBox: {
    alignItems: 'center',
    backgroundColor: '#f0f2ff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  points: { fontSize: 28, fontWeight: '700' },
  subText: { color: '#555', marginTop: 6 },
  gmailButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 2,
  },
  gmailText: { fontWeight: '600', marginRight: 6 },
  gmailIcon: { width: 18, height: 18 },

  cardSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
  },
  addCard: {
    backgroundColor: '#2F2F4F',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
  },
  addText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },

  spendBox: {
    backgroundColor: '#eef0ff',
    padding: 20,
    borderRadius: 16,
  },
  spendSub: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  spendAmount: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  breakupLink: {
    color: '#3D5CFF',
    fontWeight: '600',
  },

  askSavvy: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  askSavvyText: {
    color: '#fff',
    fontWeight: '600',
  },

  tabBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tab: {
    color: '#777',
    fontSize: 14,
  },
  tabActive: {
    color: '#3D5CFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
