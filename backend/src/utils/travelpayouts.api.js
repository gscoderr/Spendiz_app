import axios from "axios";

export const getFlightOffers = async (from, to, date) => {
  const marker = process.env.TRAVELPAYOUTS_MARKER;

  const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates`;
  const headers = {
    "X-Access-Token": process.env.TRAVELPAYOUTS_API_TOKEN,
  };

  try {
    const response = await axios.get(url, {
      params: {
        origin: from,
        destination: to,
        departure_at: date,
        return_at: null,
        currency: "INR",
        sorting: "price",
        direct: false,
        limit: 10,
        marker,
      },
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("🛑 Travel API error:", error.message);
    throw new Error("Failed to fetch travel offers.");
  }
};
