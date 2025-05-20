import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import TopBar from "../component/topbar";
import HandlerBackButton from "../component/backbutton";

export default function SubCategory() {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  const formattedCategoryName =
    category.charAt(0).toUpperCase() + category.slice(1);

  const subCategories = {
    shopping: [
      { label: "Online Shopping", icon: <FontAwesome5 name="shopping-cart" size={32} color="#6A5AE0" /> },
      { label: "Offline Shopping", icon: <MaterialCommunityIcons name="storefront" size={32} color="#F4B400" /> },
      { label: "Fashion & Lifestyle", icon: <FontAwesome5 name="tshirt" size={32} color="#6A5AE0" /> },
      { label: "Electronics", icon: <FontAwesome5 name="mobile-alt" size={32} color="#F4B400" /> },
    ],
    dining: [
      { label: "Restaurant", icon: <MaterialCommunityIcons name="silverware-fork-knife" size={32} color="#6A5AE0" /> },
      { label: "Quick Bites", icon: <MaterialCommunityIcons name="hamburger" size={32} color="#F4B400" /> },
      { label: "Café", icon: <MaterialCommunityIcons name="coffee" size={32} color="#6A5AE0" /> },
      { label: "Food Delivery", icon: <MaterialCommunityIcons name="bike-fast" size={32} color="#F4B400" /> },
    ],
    travel: [
      { label: "Flights", icon: <MaterialCommunityIcons name="airplane" size={32} color="#6A5AE0" /> },
      { label: "Trains", icon: <MaterialCommunityIcons name="train" size={32} color="#F4B400" /> },
      { label: "Metro", icon: <MaterialCommunityIcons name="subway-variant" size={32} color="#6A5AE0" /> },
      { label: "Cab Services", icon: <MaterialCommunityIcons name="taxi" size={32} color="#F4B400" /> },
      { label: "Hotels", icon: <MaterialCommunityIcons name="hotel" size={32} color="#6A5AE0" /> },
    ],
    entertainment: [
      { label: "Movies", icon: <MaterialCommunityIcons name="movie-open" size={32} color="#6A5AE0" /> },
      { label: "Events", icon: <MaterialCommunityIcons name="calendar-star" size={32} color="#F4B400" /> },
      { label: "Gaming", icon: <MaterialCommunityIcons name="gamepad-variant" size={32} color="#6A5AE0" /> },
      { label: "OTT", icon: <MaterialCommunityIcons name="television-classic" size={32} color="#F4B400" /> },
    ],
  };

  const handlePress = (subCategoryLabel) => {
    router.push({
      pathname: "/screens/categoryform",
      params: {
        category,
        subCategory: subCategoryLabel,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D2B" />
      <TopBar screen={formattedCategoryName} />

      <View style={styles.header}>
        <Text style={styles.heading}>Choose Sub-Category</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {subCategories[category]?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handlePress(item.label)}
            >
              {item.icon}
              <Text style={styles.cardText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D2B",
    
  },
  header: {
    marginTop: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    color: "#333",
  },
});
