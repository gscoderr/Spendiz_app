import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Linking } from "react-native";
import api from "../../utils/axiosInstance";

export default function OfferList() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await api.get("/offers/easemytrip");
                console.log("📦 Offers fetched from backend:", res.data.data);
                setOffers(res.data.data || []);
            } catch (error) {
                console.error("❌ Error fetching offers:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#3D5CFF" style={{ marginTop: 24 }} />;
    }

    if (offers.length === 0) {
        return <Text style={{ textAlign: "center", marginTop: 20 }}>No offers found.</Text>;
    }

      try {
        // ✅ Optional console for debug
        console.log("📦 Sending cards:", userSavedCards);
        console.log("🛡️ Token:", token);

        const res = await api.post(
          "/offers/smartbuy/matching",
          { cards: userSavedCards },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOffers(res.data.data || []);
      } catch (error) {
        console.error(
          "❌ Error fetching SmartBuy offers:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [userSavedCards]);

  if (loading) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>🔥 Offers</Text>
            <View style={styles.grid}>
                {offers.map((item) => (
                    <View key={item._id} style={styles.offerCard}>
                        <Image
                            source={{ uri: item.image || require("../../assets/banks/sbi.png") }}
                            style={styles.offerImage}
                            resizeMode="cover"
                        />

                        <Text style={styles.offerTitle}>{item.title}</Text>

                        <Text
                            style={styles.offerBenefit}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.benefit || "Special offer available!"}
                        </Text>

                        <Text style={styles.offerBank}>{item.bank}</Text>

                        <Text style={styles.offerExpiry}>
                            Valid till:{" "}
                            {new Date(item.validTill).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </Text>

                        {item.tnc && (
                            <Text
                                style={styles.offerLink}
                                onPress={() => Linking.openURL(item.tnc)}
                            >
                                View Details →
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
  }

  if (offers.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No SmartBuy offers found.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🔥 SmartBuy Offers</Text>
      <View style={styles.grid}>
        {offers.map((item) => (
          <View key={item._id} style={styles.offerCard}>
            <Image
              source={
                item.image
                  ? { uri: item.image }
                  : require("../../assets/banks/sbi.png")
              }
              style={styles.offerImage}
              resizeMode="contain"
            />
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerBenefit}>{item.benefit}</Text>
            <Text style={styles.offerBank}>{item.bank}</Text>
            <Text style={styles.offerExpiry}>
              Valid till:{" "}
              {new Date(item.validTill).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
            {item.tnc && (
              <Text
                style={styles.offerLink}
                onPress={() => Linking.openURL(item.tnc)}
              >
                View Details →
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        // paddingHorizontal: 12,
    },
    sectionTitle: {
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 10,
        color: "#000",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    offerCard: {
        backgroundColor: "#eef0ff",
        borderRadius: 12,
        padding: 10,
        marginBottom: 16,
        width: "48%",
    },
    offerImage: {
        width: "100%",
        aspectRatio: 3.5, // e.g., width: 350px → height: 100px
        borderRadius: 8,
        marginBottom: 8,
    },
    offerTitle: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 4,
        color: "#333",
    },
    offerBenefit: {
        fontSize: 12,
        color: "#444",
        lineHeight: 16,
        marginBottom: 4,
    },
    offerBank: {
        fontSize: 12,
        color: "#555",
    },
    offerExpiry: {
        fontSize: 11,
        color: "#999",
        marginTop: 4,
    },
    offerLink: {
        marginTop: 6,
        color: "#3D5CFF",
        fontSize: 12,
        fontWeight: "500",
        textDecorationLine: "underline",
    },
});
