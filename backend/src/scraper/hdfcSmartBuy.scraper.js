import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import Offer from "../models/offer.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

puppeteer.use(StealthPlugin());
dotenv.config({ path: "../../.env" });

const SMARTBUY_URL = "https://offers.reward360.in/v1/partners";
const __filename = fileURLToPath(import.meta.url);

const scrapeSmartBuyOffers = async () => {
  console.log("⚡ STEP 1: Launching Puppeteer...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36"
  );

  console.log("🌐 STEP 2: Navigating to SmartBuy...");
  await page.goto(SMARTBUY_URL, { waitUntil: "networkidle2", timeout: 60000 });

  console.log("⏳ STEP 3: Waiting for 5s + scroll for lazy content...");
  await new Promise(res => setTimeout(res, 5000));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(res => setTimeout(res, 2000));

  console.log("✅ STEP 4: Looking for .content_div_low...");
  try {
    await page.waitForSelector(".content_div_low", { timeout: 15000 });
    console.log("✅ Found .content_div_low cards.");
  } catch {
    console.warn("❌ .content_div_low not found. Saving screenshot...");
    await page.screenshot({ path: "error_content_div_low_not_found.png", fullPage: true });
    await browser.close();
    return [];
  }

  console.log("🧲 STEP 5: Scraping offer data...");
  const offers = await page.evaluate(() => {
    const data = [];
    document.querySelectorAll(".content_div_low").forEach(el => {
      const pTags = el.querySelectorAll("p.card_p_text");
      const line1 = pTags[0]?.innerText?.trim() || "";
      const line2 = pTags[1]?.innerText?.trim() || "";

      if (line1 && line2) {
        data.push({
          title: `${line1} ${line2}`,
          source: "SmartBuy",
        });
      }
    });
    return data;
  });

  await browser.close();

  console.log(`📦 STEP 6: Total Offers Found: ${offers.length}`);
  if (offers.length === 0) {
    console.warn("⚠️ No offers parsed. Check selectors or layout.");
    return;
  }

  console.log("💾 STEP 7: Saving to MongoDB...");
  for (const offer of offers) {
    await Offer.updateOne(
      { title: offer.title },
      {
        $set: {
          ...offer,
          bank: "HDFC Bank",
          category: "Shopping",
          subCategory: "SmartBuy",
          validTill: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
      },
      { upsert: true }
    );
  }

  console.log("✅ STEP 8: Offers saved to DB ✅");
};

export default scrapeSmartBuyOffers;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("🟢 CLI RUN: Executing scraper directly...");
  mongoose.connect(process.env.MONGO_URI, { dbName: "spendizDB" }).then(() => {
    console.log("✅ MongoDB Connected");
    scrapeSmartBuyOffers().then(() => {
      console.log("🏁 Done.");
      process.exit();
    }).catch(err => {
      console.error("❌ Scraper Error:", err.message);
    });
  }).catch(err => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });
}
