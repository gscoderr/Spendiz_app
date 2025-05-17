import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.header}>
        <Text style={styles.name}>Gog GS</Text>
        <Text style={styles.phone}>9599921651</Text>
        <Text style={styles.email}>priyanka.ecomitsol@gmail.com</Text>
      </View>

      {/* Premium Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Subscribe to premium & get exclusive benefits</Text>
        <TouchableOpacity style={styles.subscribeBtn}>
          <Text style={styles.subscribeText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>

      {/* Action Items */}
      <View style={styles.menu}>
        <MenuItem label="My Details" onPress={() => router.push('/my-details')} icon="person" />
        <MenuItem label="Bill Payments History" onPress={() => router.push('/payments')} icon="document-text" />
        <MenuItem
          label="Link Your Gmail"
          onPress={() => router.push('/link-gmail')}
          icon="mail"
          actionLabel="Action Required"
        />
        <MenuItem label="My Buddy Details" locked icon="headset" />
        <MenuItem label="Refer and Earn" onPress={() => router.push('/refer')} icon="megaphone" />
        <MenuItem label="Join WhatsApp Channel" onPress={() => Linking.openURL('https://wa.me/yourchannel')} icon="logo-whatsapp" />
        <MenuItem label="Overview Video" onPress={() => router.push('/overview')} icon="logo-youtube" />
        <MenuItem label="Share Feedback" onPress={() => router.push('/feedback')} icon="flag" />
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ label, onPress, icon, actionLabel, locked }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={onPress}
    disabled={locked}
  >
    <Ionicons name={icon} size={20} color="#000" />
    <Text style={styles.itemLabel}>{label}</Text>
    {actionLabel && (
      <View style={styles.actionBadge}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </View>
    )}
    {locked ? (
      <Ionicons name="lock-closed" size={16} color="#999" />
    ) : (
      <Ionicons name="chevron-forward" size={18} color="#888" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold' },
  phone: { fontSize: 16, color: '#555' },
  email: { fontSize: 16, color: '#555' },

  banner: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  subscribeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  subscribeText: { color: '#2563eb', fontWeight: '600' },

  menu: { marginTop: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: '#eee',
  },
  itemLabel: { flex: 1, marginLeft: 10, fontSize: 16 },
  actionBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 10,
  },
  actionText: { color: '#b91c1c', fontSize: 12, fontWeight: '600' },
});
