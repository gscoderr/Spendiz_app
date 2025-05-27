// backend/src/scraper/fetchHTML.js
import axios from "axios";

export const fetchHTML = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90 Safari/537.36",
      },
    });
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch HTML:", error.message);
    return null;
  }
};
