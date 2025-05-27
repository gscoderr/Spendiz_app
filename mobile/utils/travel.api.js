export const getTravelDeals = async (from, to, date) => {
  try {
    const res = await api.get("/travel/flights", {
      params: { from, to, date },
    });

    const raw = res.data?.data;

    // ✅ Transform to safe structure
    if (!Array.isArray(raw)) return [];

    const cleaned = raw.map((item) => ({
      origin: item.origin || "",
      destination: item.destination || "",
      airline: item.airline || "N/A",
      value: item.value || item.price || "N/A", // ✅ Fallback to 'price' if 'value' missing
    }));

    return cleaned;
  } catch (err) {
    console.warn("❌ Error fetching travel deals", err);
    return [];
  }
};
