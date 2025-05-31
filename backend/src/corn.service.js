import cron from "node-cron";
import scrapeEasyMyTripOffers from "./scraper/easyMyTrip.scraper.js";

cron.schedule("0 */12 * * *", async () => {
// cron.schedule("*/1 * * * *", async () => {
  console.log("🟡 CRON TRIGGERED: Running EaseMyTrip Scraper...");

  try {
    await scrapeEasyMyTripOffers();
    console.log("✅ CRON SUCCESS: EaseMyTrip Offers Updated");
  } catch (err) {
    console.error("❌ CRON ERROR:", err.message);
  }
});
