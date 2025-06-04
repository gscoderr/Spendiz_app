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

// ICICI Bank Offers Scraper — Runs daily at 1:00 AM
cron.schedule("0 1 * * *", async () => {
  console.log("🟢 CRON: Running ICICI Bank Scraper...");
  try {
    await scrapeICICIOffers();
    console.log("✅ ICICI Bank Offers Updated");
  } catch (err) {
    console.error("❌ ICICI Scraper Error:", err.message);
  }
});

// HDFC SmartBuy Scraper — Runs daily at 2:00 AM
cron.schedule("0 2 * * *", async () => {
  console.log("🔵 CRON: Running SmartBuy Scraper...");
  try {
    await scrapeSmartBuyOffers();
    console.log("✅ SmartBuy Offers Updated");
  } catch (err) {
    console.error("❌ SmartBuy Scraper Error:", err.message);
  }
});