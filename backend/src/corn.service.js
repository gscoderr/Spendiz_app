import cron from "node-cron";
import scrapeSmartBuyOffers from "./scraper/hdfcSmartBuy.scraper.js"; // ✅ relative to src/

console.log("⏰ SmartBuy Cron Service Started");

// Run every 12 hours → at 00:00 and 12:00
cron.schedule("0 */12 * * *", async () => {                           
// cron.schedule("*/1 * * * *", async () => {                         
  console.log("🟡 CRON TRIGGERED: Running SmartBuy Scraper...");

  try {
    await scrapeSmartBuyOffers();
    console.log("✅ CRON SUCCESS: SmartBuy Offers Updated");
  } catch (err) {
    console.error("❌ CRON ERROR:", err.message);
  }
});


// isme time lagega dowlowad hone meok ok bahut salow internet hai 300 400 mb ka hoga bas ok mujhe call kar lena ho jai to . 