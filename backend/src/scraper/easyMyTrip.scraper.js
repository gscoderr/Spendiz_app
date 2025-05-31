import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

puppeteer.use(StealthPlugin());

// Setup path & env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const EMT_URL = "https://www.easemytrip.com/offers/bank-deals.html";

// 🔍 Extract ₹/INR value from string
function extractDiscountValue(text) {
    const match = text?.match(/₹\s?(\d+[,\d]*)|INR\s?(\d+[,\d]*)/i);
    if (match) {
        const value = match[1] || match[2];
        return parseInt(value.replace(/,/g, ""), 10);
    }
    return undefined;
}

const scrapeEaseMyTripOffers = async () => {
    console.log("🔁 [EaseMyTrip] Scraper started...");

    const offers = [];
    let browser;

    try {
        console.log("⚡ Launching Puppeteer...");
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36"
        );

        console.log("🌍 Navigating to:", EMT_URL);
        await page.goto(EMT_URL, { waitUntil: "networkidle2", timeout: 60000 });

        console.log("⏳ Waiting & Scrolling...");
        await new Promise((res) => setTimeout(res, 4000));
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise((res) => setTimeout(res, 2000));

        console.log("🔎 Looking for ._offrbx blocks...");
        await page.waitForSelector("._offrbx", { timeout: 15000 });

        const rawOffers = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("._offrbx")).map((el) => {
                const title = el.querySelector(".dealName")?.innerText?.trim() || "";
                const desc = el.querySelector(".dealDtl")?.innerText?.trim() || "";
                const img = el.querySelector("img")?.src || "";
                const link = el.href || "";
                const promo = el.querySelector(".coupncode")?.innerText?.trim() || "";
                const validity = el.querySelector(".booking_prd")?.innerText?.trim() || "";
                return { title, desc, img, link, promo, validity };
            });
        });

        console.log(`📦 Found ${rawOffers.length} raw offers`);
        console.log("🔍 Logging first 3 raw offers for debugging ↓↓↓");
        console.dir(rawOffers.slice(0, 3), { depth: null });

        for (let i = 0; i < rawOffers.length; i++) {
            const o = rawOffers[i];
            console.log(`\n🔎 [Offer ${i + 1}] Raw Data:`, o);

            if (!o.title || !o.desc) {
                console.warn(`⚠️ Skipping Offer ${i + 1} — Missing title or description`);
                continue;
            }

            const structured = {
                title: o.title,
                source: "EaseMyTrip",
                bank: o.title.split(" ")[0] || "Unknown",
                cardNames: [],
                category: "Travel",
                subCategory: "Flights",
                partnerBrands: ["EaseMyTrip"],
                offerType: "Instant Discount",
                benefit: o.desc,
                discountValue: extractDiscountValue(o.desc),
                promoCode: o.promo || undefined,
                paymentMode: "Full",
                validFrom: new Date(),
                validTill: new Date("2025-06-30"),
                tnc: o.link,
                image: o.img,
                scrapedAt: new Date(),
            };

            console.log(`✅ Structured Offer ${i + 1}:`, structured);
            offers.push(structured);
        }


        return offers;
    } catch (err) {
        console.error("❌ [EaseMyTrip] Scraper Error:", err.message);
        return [];
    } finally {
        if (browser) await browser.close();
    }
};

export default scrapeEaseMyTripOffers;

// Manual test support
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    scrapeEaseMyTripOffers()
        .then(() => {
            console.log("🏁 Scraping completed.");
            process.exit(0);
        })
        .catch((err) => {
            console.error("❌ CLI Run Error:", err.message);
            process.exit(1);
        });
}
