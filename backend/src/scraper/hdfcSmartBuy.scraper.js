import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import Offer from "../models/offer.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

puppeteer.use(StealthPlugin());

// ✅ Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const SMARTBUY_URL = process.env.SMARTBUY_URL;
if (!SMARTBUY_URL) {
  console.error("❌ SMARTBUY_URL is not defined in .env file");
  process.exit(1);
}


// 📌 Extract Rs. XXXX value for minTransaction
function extractMinTransaction(text) {
  const match = text?.match(/Rs\.?\s?(\d+[,\d]*)/i);
  return match ? parseInt(match[1].replace(/,/g, ""), 10) : undefined;
}



const scrapeSmartBuyOffers = async () => {
  try {
    console.log("🧹 STEP 0: Deleting old SmartBuy offers...");
    await Offer.deleteMany({ source: "SmartBuy" });

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

    console.log("⏳ STEP 3: Scrolling for lazy content...");
    await new Promise(res => setTimeout(res, 5000));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(res => setTimeout(res, 2000));

    console.log("✅ STEP 4: Checking for .content_div_low...");
    try {
      // await page.waitForSelector(".content_div_low", { timeout: 15000 });
     
    await page.waitForSelector(".fjs_item", { timeout: 20000 });
      console.log("✅ Found content blocks.");
    } catch {
      console.warn("❌ Selector not found. Screenshot saved.");
      await page.screenshot({ path: "smartbuy_error.png", fullPage: true });
      await browser.close();
      return;
    }

    console.log("🧲 STEP 5: Scraping offer data...");
    // const offers = await page.evaluate(() => {
    //   const data = [];
    //   document.querySelectorAll(".content_div_low").forEach(el => {
    //     const pTags = el.querySelectorAll("p.card_p_text");
    //     const line1 = pTags[0]?.innerText?.trim() || "";
    //     const line2 = pTags[1]?.innerText?.trim() || "";
    //     const title = `${line1} ${line2}`.trim();
    //     if (title.length > 10) {
    //       data.push({ title, source: "SmartBuy" });
    //     }
    //   });
    //   return data;
    // });

      console.log("🧲 STEP 5: Scraping full offer cards...");
    const offers = await page.evaluate(() => {
      const items = document.querySelectorAll(".fjs_item");
      return Array.from(items).map(item => {
        const anchor = item.querySelector("a");
        const image = item.querySelector("img")?.src || "";
        const title = item.querySelector(".offerCard-title")?.innerText?.trim() || "";
        const description = item.querySelector(".offerCard-desc")?.innerText?.trim() || "";
        const tag = item.querySelector(".offerTag")?.innerText?.trim() || "";
        const category = item.querySelector(".offerCard-expiry")?.innerText?.trim() || "";
        const link = anchor?.href || "";

        return {
          title,
          description,
          image,
          tag,
          category,
          link,
        };
      });
    });

    await browser.close();

    console.log(`📦 STEP 6: Total Offers Found: ${offers.length}`);
    if (!offers.length) {
      console.warn("⚠️ No offers parsed. Check selectors.");
      return;
    }

    console.log("💾 STEP 7: Saving to MongoDB...");
    // let saved = 0;
    // for (const offer of offers) {
    //   await Offer.create({
    //     ...offer,
    //     bank: "HDFC Bank",
    //     category: "Shopping",
    //     subCategory: "SmartBuy",
    //     validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //     scrapedAt: new Date(),
    //   });
    //   saved++;
    // }

    // console.log(`✅ STEP 8: Saved ${saved}/${offers.length} offers.`);

       let saved = 0;

    for (const o of offers) {
      await Offer.create({
        title: o.title,
        source: "SmartBuy",
        bank: "HDFC Bank",
        cardNames: [],
        category: "Shopping",
        subCategory: o.category || "SmartBuy",
        partnerBrands: [o.title],
        offerType: o.tag || "Discount",
        benefit: o.description,
        minTransaction: extractMinTransaction(o.description),
        paymentMode: "Full",
        validFrom: new Date(),
        validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tnc: o.link,
        image: o.image,
        scrapedAt: new Date(),
      });
      saved++;
    }

    console.log(`✅ STEP 8: Saved ${saved}/${offers.length} offers.`);

  } catch (err) {
    console.error("❌ Scraper Error:", err.message);
  }
};

export default scrapeSmartBuyOffers;

// ✅ Only connect to DB if run directly (not via backend)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose.connect(process.env.MONGO_URI, { dbName: "spendizDB" })
    .then(() => {
      console.log("✅ MongoDB Connected (CLI)");
      return scrapeSmartBuyOffers();
    })
    .then(() => {
      console.log("🏁 Scraping Completed. Exiting.");
      process.exit();
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Failed:", err.message);
      process.exit(1);
    });
}
