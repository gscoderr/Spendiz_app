// import puppeteer from "puppeteer-extra";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// puppeteer.use(StealthPlugin());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// const ICICI_URL = "https://www.icicibank.com/offers";

// // Extract ₹ value
// function extractDiscountValue(text) {
//   const match = text?.match(/(?:₹|INR)\s?(\d+[,\d]*)/i);
//   return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
// }

// // Extract promo code
// function extractPromoCode(text) {
//   const match = text?.match(/code\s*[:\-]?\s*([A-Z0-9]+)/i);
//   return match ? match[1] : "";
// }

// // Extract date string
// function extractDate(text) {
//   const match = text?.match(/(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[ ,]*(\d{4})/i);
//   return match ? new Date(`${match[1]} ${match[2]} ${match[3]}`) : null;
// }

// const scrapeICICIOffersWithDOMTree = async () => {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"]
//   });

//   const page = await browser.newPage();
//   await page.goto(ICICI_URL, { waitUntil: "networkidle2", timeout: 60000 });
//   await page.waitForSelector(".offer-card.offer-card-v2");

//   const baseURL = "https://www.icicibank.com";

//   const offerCards = await page.evaluate((baseURL) => {
//     return Array.from(document.querySelectorAll(".offer-card.offer-card-v2")).map((el) => {
//       const title = el.querySelector(".title h2")?.innerText.trim() || "";
//       const benefit = el.querySelector(".description")?.innerText.trim() || "";
//       const img = el.querySelector("img")?.getAttribute("src") || "";
//       const href = el.querySelector("a")?.getAttribute("href") || "";
//       return {
//         title,
//         benefit,
//         image: baseURL + img,
//         link: baseURL + href
//       };
//     });
//   }, baseURL);

//   const finalOffers = [];

//   for (let i = 0; i < offerCards.length; i++) {
//     const offer = offerCards[i];
//     const detailPage = await browser.newPage();

//     try {
//       console.log(`🔍 Visiting: ${offer.link}`);
//       await detailPage.goto(offer.link, { waitUntil: "domcontentloaded", timeout: 30000 });
//       await detailPage.waitForSelector(".section-inner", { timeout: 15000 });

//       const details = await detailPage.evaluate(() => {
//         const promoCodes = Array.from(document.querySelectorAll(".offer-banner-promocode"))
//           .map(el => el.innerText.trim()).filter(Boolean);

//         const validFromText = Array.from(document.querySelectorAll("p"))
//           .find(p => p.innerText.toLowerCase().includes("offer start date"))?.innerText || "";

//         const validTillText = document.querySelector(".offer-tags .tag span")?.innerText || "";

//         const parseElementToJSON = (el) => {
//           const obj = { tag: el.tagName.toLowerCase() };
//           if (el.className) obj.class = el.className.trim();
//           if (el.innerText && el.children.length === 0) {
//             const text = el.innerText.trim();
//             if (text) obj.text = text;
//           }
//           if (obj.tag === "ul") {
//             const items = Array.from(el.querySelectorAll("li")).map(li => li.innerText.trim()).filter(Boolean);
//             if (items.length) obj.items = items;
//             return obj;
//           }
//           if (obj.tag === "table") {
//             const rows = [];
//             const trNodes = el.querySelectorAll("tbody tr");
//             trNodes.forEach((tr) => {
//               const cols = tr.querySelectorAll("td");
//               if (cols.length >= 4) {
//                 rows.push({
//                   category: cols[0].innerText.trim(),
//                   offerCode: cols[1].innerText.trim(),
//                   offerDetails: cols[2].innerText.trim(),
//                   applicableCards: cols[3].innerText.trim()
//                 });
//               }
//             });
//             obj.rows = rows;
//             return obj;
//           }
//           const children = Array.from(el.children).map(parseElementToJSON).filter(Boolean);
//           if (children.length) obj.children = children;
//           return obj;
//         };

//         const domTree = parseElementToJSON(document.querySelector(".section-inner"));
//         return {
//           promoCodes,
//           validFromText,
//           validTillText,
//           domTree
//         };
//       });

//       const structured = {
//         title: offer.title,
//         source: "ICICI Bank",
//         bank: "ICICI",
//         cardNames: [],
//         category: "Mixed",
//         subCategory: "",
//         partnerBrands: [offer.title],
//         offerType: "Discount",
//         benefit: offer.benefit,
//         discountValue: extractDiscountValue(offer.benefit),
//         minTransaction: 0,
//         paymentMode: "Full",
//         promoCode: details.promoCodes[0] || extractPromoCode(offer.benefit),
//         validFrom: extractDate(details.validFromText) || new Date(),
//         validTill: extractDate(details.validTillText) || new Date(Date.now() + 30 * 86400000),
//         tnc: offer.link,
//         image: offer.image,
//         domTree: details.domTree
//       };

//       finalOffers.push(structured);
//       await detailPage.close();

//     } catch (err) {
//       console.error(`❌ Failed to process: ${offer.title}`, err.message);
//       await detailPage.close();
//     }
//   }

//   await browser.close();

//   // 🖨️ Console Output
//   finalOffers.forEach((offer, idx) => {
//     console.log(`\n🔹 Offer ${idx + 1}: ${offer.title}`);
//     console.dir(offer, { depth: null });
//   });

//   console.log(`\n✅ Total ${finalOffers.length} ICICI offers scraped in Spendiz format.`);
// };

// scrapeICICIOffersWithDOMTree();





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

const ICICI_URL = "https://www.icicibank.com/offers";

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

// 🔍 Extract "6 Jan 2025" to Date
function extractDate(text) {
  const match = text?.match(/(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[ ,]*(\d{4})/i);
  return match ? new Date(`${match[1]} ${match[2]} ${match[3]}`) : null;
}

// ✅ Final Scraper
const scrapeICICIOffers = async () => {
  try {
    console.log("🧹 Deleting old ICICI offers...");
    await Offer.deleteMany({ source: "ICICI Bank" });

    console.log("⚡ Launching browser...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

    console.log("🌐 Visiting ICICI Offers page...");
    await page.goto(ICICI_URL, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector(".offer-card.offer-card-v2");

    const baseURL = "https://www.icicibank.com";

    const offerCards = await page.evaluate((baseURL) => {
      return Array.from(document.querySelectorAll(".offer-card.offer-card-v2")).map((el) => {
        const title = el.querySelector(".title h2")?.innerText.trim() || "";
        const benefit = el.querySelector(".description")?.innerText.trim() || "";
        const img = el.querySelector("img")?.getAttribute("src") || "";
        const href = el.querySelector("a")?.getAttribute("href") || "";
        return {
          title,
          benefit,
          image: baseURL + img,
          link: baseURL + href
        };
      });
    }, baseURL);

    const finalOffers = [];

    for (let i = 0; i < offerCards.length; i++) {
      const offer = offerCards[i];
      const detailPage = await browser.newPage();

      try {
        console.log(`🔍 Visiting: ${offer.link}`);
        await detailPage.goto(offer.link, { waitUntil: "domcontentloaded", timeout: 30000 });
        await detailPage.waitForSelector(".section-inner", { timeout: 15000 });

        const details = await detailPage.evaluate(() => {
          const promoCodes = Array.from(document.querySelectorAll(".offer-banner-promocode"))
            .map(el => el.innerText.trim()).filter(Boolean);

          const validFromText = Array.from(document.querySelectorAll("p"))
            .find(p => p.innerText.toLowerCase().includes("offer start date"))?.innerText || "";

          const validTillText = document.querySelector(".offer-tags .tag span")?.innerText || "";

          const parseElementToJSON = (el) => {
            const obj = { tag: el.tagName.toLowerCase() };
            if (el.className) obj.class = el.className.trim();
            if (el.innerText && el.children.length === 0) {
              const text = el.innerText.trim();
              if (text) obj.text = text;
            }
            if (obj.tag === "ul") {
              const items = Array.from(el.querySelectorAll("li")).map(li => li.innerText.trim()).filter(Boolean);
              if (items.length) obj.items = items;
              return obj;
            }
            if (obj.tag === "table") {
              const rows = [];
              const trNodes = el.querySelectorAll("tbody tr");
              trNodes.forEach((tr) => {
                const cols = tr.querySelectorAll("td");
                if (cols.length >= 4) {
                  rows.push({
                    category: cols[0].innerText.trim(),
                    offerCode: cols[1].innerText.trim(),
                    offerDetails: cols[2].innerText.trim(),
                    applicableCards: cols[3].innerText.trim()
                  });
                }
              });
              obj.rows = rows;
              return obj;
            }
            const children = Array.from(el.children).map(parseElementToJSON).filter(Boolean);
            if (children.length) obj.children = children;
            return obj;
          };

          const domTree = parseElementToJSON(document.querySelector(".section-inner"));
          return {
            promoCodes,
            validFromText,
            validTillText,
            domTree
          };
        });

        const structured = {
          title: offer.title,
          source: "ICICI Bank",
          bank: "ICICI",
          cardNames: [],
          category: "Mixed",
          subCategory: "",
          partnerBrands: [offer.title],
          offerType: "Discount",
          benefit: offer.benefit,
          discountValue: extractDiscountValue(offer.benefit),
          minTransaction: 0,
          paymentMode: "Full",
          promoCode: details.promoCodes[0] || extractPromoCode(offer.benefit),
          validFrom: extractDate(details.validFromText) || new Date(),
          validTill: extractDate(details.validTillText) || new Date(Date.now() + 30 * 86400000),
          tnc: offer.link,
          image: offer.image,
          scrapedAt: new Date(),
          domTree: details.domTree // ✅ extra field
        };

        finalOffers.push(structured);
        await detailPage.close();

      } catch (err) {
        console.error(`❌ Failed to process: ${offer.title}`, err.message);
        await detailPage.close();
      }
    }

    await browser.close();

    // 💾 Save to DB
    console.log("💾 Inserting offers into MongoDB...");
    const savedOffers = await Offer.insertMany(finalOffers);

    console.log(`✅ Saved ${savedOffers.length} ICICI offers.`);
    savedOffers.forEach((offer, idx) => {
      console.log(`\n🔹 Offer ${idx + 1}:`);
      console.log({
        title: offer.title,
        bank: offer.bank,
        discountValue: offer.discountValue,
        promoCode: offer.promoCode,
        validTill: offer.validTill?.toISOString().split("T")[0],
        source: offer.source,
        category: offer.category,
        subCategory: offer.subCategory
      });
    });

  } catch (err) {
    console.error("❌ Scraper Error:", err.message);
  }
};

export default scrapeICICIOffers;

// 🔃 Allow CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose.connect(process.env.MONGO_URI, { dbName: "spendizDB" })
    .then(() => {
      console.log("✅ MongoDB Connected");
      return scrapeICICIOffers();
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
