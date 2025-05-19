import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

export default function SubCategory() {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;

  const subCategories = {
    shopping: [
      {
        label: "Online Shopping",
        icon: (
          <FontAwesome5 name="shopping-cart" size={32} color="#6A5AE0" />
        ),
      },
      {
        label: "Offline Shopping",
        icon: (
          <MaterialCommunityIcons
            name="storefront"
            size={32}
            color="#F4B400"
          />
        ),
      },
      {
        label: "Fashion & Lifestyle",
        icon: (
          <FontAwesome5 name="tshirt" size={32} color="#6A5AE0" />
        ),
      },
      {
        label: "Electronics",
        icon: (
          <FontAwesome5 name="mobile-alt" size={32} color="#F4B400" />
        ),
      },
    ],
    dining: [
      {
        label: "Restaurant",
        icon: (
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={32}
            color="#6A5AE0"
          />
        ),
      },
      {
        label: "Quick Bites",
        icon: (
          <MaterialCommunityIcons name="hamburger" size={32} color="#F4B400" />
        ),
      },
      {
        label: "Café",
        icon: (
          <MaterialCommunityIcons name="coffee" size={32} color="#6A5AE0" />
        ),
      },
      {
        label: "Food Delivery",
        icon: (
          <MaterialCommunityIcons
            name="bike-fast"
            size={32}
            color="#F4B400"
          />
        ),
      },
    ],
    travel: [
      {
        label: "Flights",
        icon: (
          <MaterialCommunityIcons name="airplane" size={32} color="#6A5AE0" />
        ),
      },
      {
        label: "Trains",
        icon: (
          <MaterialCommunityIcons name="train" size={32} color="#F4B400" />
        ),
      },
      {
        label: "Metro",
        icon: (
          <MaterialCommunityIcons
            name="subway-variant"
            size={32}
            color="#6A5AE0"
          />
        ),
      },
      {
        label: "Cab Services",
        icon: (
          <MaterialCommunityIcons name="taxi" size={32} color="#F4B400" />
        ),
      },
      {
        label: "Hotels",
        icon: (
          <MaterialCommunityIcons name="hotel" size={32} color="#6A5AE0" />
        ),
      },
    ],
    entertainment: [
      {
        label: "Movies",
        icon: (
          <MaterialCommunityIcons
            name="movie-open"
            size={32}
            color="#6A5AE0"
          />
        ),
      },
      {
        label: "Events",
        icon: (
          <MaterialCommunityIcons
            name="calendar-star"
            size={32}
            color="#F4B400"
          />
        ),
      },
      {
        label: "Gaming",
        icon: (
          <MaterialCommunityIcons
            name="gamepad-variant"
            size={32}
            color="#6A5AE0"
          />
        ),
      },
      {
        label: "OTT",
        icon: (
          <MaterialCommunityIcons
            name="television-classic"
            size={32}
            color="#F4B400"
          />
        ),
      },
    ],
  };

  const handlePress = (subCategoryLabel) => {
    let targetScreen = "";

    switch (category) {
      case "travel":
        targetScreen = "travelform";
        break;
      case "shopping":
        targetScreen = "shoppingform";
        break;
      case "dining":
        targetScreen = "diningform";
        break;
      case "entertainment":
        targetScreen = "entertainmentform";
        break;
      default:
        targetScreen = "form"; // fallback
    }

    navigation.navigate(targetScreen, {
      category,
      subCategory: subCategoryLabel,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>SPEND CATEGORY</Text>
      <Text style={styles.heading}>Choose Sub-Category</Text>

      <ScrollView contentContainerStyle={styles.grid}>
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
      </ScrollView>

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D2B",
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 100,
  },
  card: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  closeBtn: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
  },
  closeText: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
