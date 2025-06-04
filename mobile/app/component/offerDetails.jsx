// 📁 app/components/OfferDetails.jsx

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import api from "../../utils/axiosInstance.js";

// Recursive Renderer for domTree
const renderDomTree = (node) => {
  if (!node || typeof node !== "object") return null;

  const style = styles[node.tag] || styles.default;

  if (node.tag === "ul" && Array.isArray(node.items)) {
    return (
      <View style={styles.list}>
        {node.items.map((item, idx) => (
          <Text key={idx} style={styles.listItem}>• {item}</Text>
        ))}
      </View>
    );
  }

  if (node.tag === "table" && Array.isArray(node.rows)) {
    return (
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.th}>Category</Text>
          <Text style={styles.th}>Code</Text>
          <Text style={styles.th}>Details</Text>
          <Text style={styles.th}>Cards</Text>
        </View>
        {node.rows.map((row, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.td}>{row.category}</Text>
            <Text style={styles.td}>{row.offerCode}</Text>
            <Text style={styles.td}>{row.offerDetails}</Text>
            <Text style={styles.td}>{row.applicableCards}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={style}>
      {node.text && <Text style={styles.text}>{node.text}</Text>}
      {node.children?.map((child, idx) => (
        <View key={idx}>{renderDomTree(child)}</View>
      ))}
    </View>
  );
};

export default function OfferDetails({ offerId }) {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOffer = async () => {
    try {
      const res = await api.get(`/offers/${offerId}`);
      setOffer(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch offer", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (offerId) fetchOffer();
  }, [offerId]);

  if (loading) return <ActivityIndicator size="large" color="#000" style={{ marginTop: 30 }} />;

  if (!offer) return <Text style={{ marginTop: 30, color: "red" }}>Offer not found.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.subtext}>{offer.bank} — {offer.category}</Text>
      <Text style={styles.validity}>
        Valid Till: {new Date(offer.validTill).toLocaleDateString()}
      </Text>

      {/* 🔍 Render domTree */}
      <View style={styles.section}>
        {renderDomTree(offer.domTree)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4
  },
  subtext: {
    fontSize: 14,
    color: "#666"
  },
  validity: {
    fontSize: 12,
    color: "#444",
    marginBottom: 12
  },
  section: {
    paddingVertical: 10
  },
  text: {
    fontSize: 15,
    marginBottom: 6
  },
  list: {
    marginBottom: 10
  },
  listItem: {
    fontSize: 14,
    paddingLeft: 10,
    marginBottom: 4
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0"
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ccc"
  },
  th: {
    flex: 1,
    fontWeight: "bold",
    padding: 6,
    fontSize: 13
  },
  td: {
    flex: 1,
    padding: 6,
    fontSize: 13
  },
  default: {
    marginVertical: 4
  }
});
