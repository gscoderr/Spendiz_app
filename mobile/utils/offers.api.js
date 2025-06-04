import api from "./axiosInstance";

export const fetchMatchingOffers = async ({ cards, category, subCategory }) => {
  try {
    const res = await api.post("/offers/matching", {
      cards,
      category,
      subCategory,
    });

    
    return res.data.data || [];
  } catch (error) {
    console.error("❌ Error fetching offers:", error.response?.data || error.message);
    return [];
  }
};
