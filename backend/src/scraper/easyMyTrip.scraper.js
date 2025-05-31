// src/scraper/easyMyTrip.scraper.js

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import Offer from "../models/offer.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

puppeteer.use(StealthPlugin());

// Setup .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const EMT_URL = "https://www.easemytrip.com/offers/bank-deals.html";

// 🔍 Extract ₹ amount
function extractDiscountValue(text) {
    const match = text?.match(/(?:₹|INR)\s?(\d+[,\d]*)/i);
    return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
}

// 🔍 Extract promo code
function extractPromoCode(text) {
    const match = text?.match(/code\s*[:\-]?\s*([A-Z0-9]+)/i);
    return match ? match[1] : "";
}

// 🔍 Extract "31st Dec, 2025" to valid Date
function extractValidTill(text) {
    const match = text?.match(/(\d{1,2})\s*(st|nd|rd|th)?\s*([A-Za-z]+),?\s*(\d{4})/i);
    if (!match) return null;
    const dateStr = `${match[1]} ${match[3]} ${match[4]}`;
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
}

// ✅ Final Scraper
const scrapeEasyMyTripOffers = async () => {
    try {
        console.log("🧹 Deleting old EaseMyTrip offers...");
        await Offer.deleteMany({ source: "EaseMyTrip" });

        console.log("⚡ Launching browser...");
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

        console.log("🌐 Visiting EaseMyTrip Offers page...");
        await page.goto(EMT_URL, { waitUntil: "networkidle2", timeout: 60000 });

        console.log("⏳ Waiting for ._offrbx blocks...");
        await page.waitForSelector("._offrbx", { timeout: 15000 });

        const rawOffers = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("._offrbx")).map((el) => {
                const lines = el.innerText?.split("\n").filter(Boolean) || [];
                const title = lines[0] || "";
                const desc = lines[1] || "";
                const validity = lines.find(line => line.toLowerCase().includes("valid till")) || "";
                const img = el.querySelector("img")?.src || "";
                const link = el.href || "";
                const promo = el.querySelector(".coupncode")?.innerText?.trim() || "";
                return { title, desc, img, link, promo, validity };
            });
        });

        await browser.close();
        console.log(`📦 Found ${rawOffers.length} raw offers`);

        if (!rawOffers.length) {
            console.warn("⚠️ No offers scraped. Exiting...");
            return;
        }

        // 🚩 Filter & Structure Offers
        const knownBanks = ["HDFC", "ICICI", "SBI", "Axis", "RBL", "BOB", "Kotak", "Yes", "IDFC"];
        const structuredOffers = rawOffers
            .filter(o => o.title && o.desc)
            .map((o) => {
                const detectedBank = knownBanks.find(bank => o.title.toUpperCase().includes(bank.toUpperCase()));
                return {
                    title: o.title || "Untitled Offer",
                    source: "EaseMyTrip",
                    bank: detectedBank || "Various",
                    cardNames: [],
                    category: "Travel",
                    subCategory: "Flights",
                    partnerBrands: [o.title],
                    offerType: "Discount",
                    benefit: o.desc || "",
                    discountValue: extractDiscountValue(o.desc) || 0,
                    minTransaction: 0,
                    paymentMode: "Full",
                    promoCode: o.promo || extractPromoCode(o.desc) || "",
                    validFrom: new Date(),
                    validTill: extractValidTill(o.validity) || new Date(Date.now() + 30 * 86400000),
                    tnc: o.link || "",
                    image: o.img || "",
                };
            });

        // 💾 Save to DB
        console.log("💾 Inserting offers into MongoDB...");
        const savedOffers = await Offer.insertMany(structuredOffers);

        console.log(`✅ Saved ${savedOffers.length} EaseMyTrip offers.`);

        // 🖨️ Show each offer (nicely)
        savedOffers.forEach((offer, idx) => {
            console.log(`\n🔹 Offer ${idx + 1}:`);
            console.log({
                title: offer.title,
                bank: offer.bank,
                discountValue: offer.discountValue,
                promoCode: offer.promoCode,
                validTill: offer.validTill.toISOString().split("T")[0],
                source: offer.source,
                category: offer.category,
                subCategory: offer.subCategory
            });
        });

        console.log(`✅ Saved ${structuredOffers.length} EaseMyTrip offers.`);
    } catch (err) {
        console.error("❌ Scraper Error:", err.message);
    }
};

export default scrapeEasyMyTripOffers;

// 🔃 Allow CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    mongoose.connect(process.env.MONGO_URI, { dbName: "spendizDB" })
        .then(() => {
            console.log("✅ MongoDB Connected");
            return scrapeEasyMyTripOffers();
        })
        .then(() => {
            console.log("🏁 Scraping complete. Exiting...");
            process.exit(0);
        })
        .catch((err) => {
            console.error("❌ MongoDB Error:", err.message);
            process.exit(1);
        });
}
