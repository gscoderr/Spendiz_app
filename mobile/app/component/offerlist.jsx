import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import api from "../../utils/axiosInstance";

export default function OfferList() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await api.get("/offers/smartbuy");
                console.log("📦 Offers fetched from backend:", res.data.data); // ✅ confirm hit
                setOffers(res.data.data || []);
            } catch (error) {
                console.error("❌ Error fetching offers:", error.message);
            } finally {
                setLoading(false);
            }
            //require("../../assets/banks/sbi.png")
        };
        fetchOffers();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#3D5CFF" style={{ marginTop: 24 }} />;
    if (offers.length === 0) return <Text style={{ textAlign: "center", marginTop: 20 }}>No offers found.</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>🔥 SmartBuy Offers</Text>
            <View style={styles.grid}>
                {offers.map((item) => (
                    <View key={item._id} style={styles.offerCard}>
                        <Image
                            source={{ uri: item.image || require("../../assets/banks/sbi.png") }}
                            style={styles.offerImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.offerTitle}>{item.title}</Text>
                        <Text style={styles.offerBenefit}>{item.benefit}</Text>

                        <Text style={styles.offerBank}>{item.bank}</Text>
                        <Text style={styles.offerExpiry}>
                            Valid till: {new Date(item.validTill).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </Text>

                        {item.tnc && (
                            <Text
                                style={styles.offerLink}
                                onPress={() => {
                                    // ✅ open TnC link in browser
                                    Linking.openURL(item.tnc);
                                }}
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
    },
    offerBenefit: {
        fontSize: 12,
        color: "#444",
        marginVertical: 6,
    },

    offerLink: {
        marginTop: 6,
        color: "#3D5CFF",
        fontSize: 12,
        fontWeight: "500",
        textDecorationLine: "underline",
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
        padding: 14,
        marginBottom: 16,
        width: "48%",
    },
    offerImage: {
        width: "100%",
        height: 40,
        marginBottom: 8,
    },
    offerTitle: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 6,
        color: "#333",
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
});
