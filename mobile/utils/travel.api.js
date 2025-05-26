export const getTravelDeals = async (from, to, date) => {
  try {
    const res = await api.get(`/travel/flights`, {
      params: { from, to, date },
    });
    return res.data?.data;
  } catch (err) {
    console.warn("❌ Error fetching travel deals", err);
    return [];
  }
};