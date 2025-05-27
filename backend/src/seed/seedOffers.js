// import mongoose from "mongoose";
// import fs from "fs";
// import CardOffer from "../models/cardoffers.model.js";


// const MONGO_URI = "";


// const run = async () => {
//   await mongoose.connect(MONGO_URI);
//   const cards = JSON.parse(fs.readFileSync("mastercards_formatted.json", "utf-8"));

//   const flattenedOffers = [];

//   for (const card of cards) {
//     if (!card.offers || !Array.isArray(card.offers)) continue;

//     for (const offer of card.offers) {
//       flattenedOffers.push({
//         // Optional: you can include a cardId if you're referencing mastercards later
//         bank: card.bank,
//         cardName: card.cardName,
//         network: card.network,
//         tier: card.tier,
//         type: card.type,
//         ...offer
//       });
//     }
//   }

//   await CardOffer.insertMany(flattenedOffers);
//   console.log(`✅ Inserted ${flattenedOffers.length} offers into cardoffers`);
// };
// run();

import mongoose from "mongoose";
import Offer from "../models/offer.model.js";

const MONGO_URI = "mongodb+srv://gorvindcode:8BQOS6zSsqulaSpendiz@cluster0.sueniyy.mongodb.net/spendizDB?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your actual Atlas URI

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const testOffer = {
      bank: "SBI",
      cardNames: ["SBI Card PRIME"], // exact name as in your saved card
      category: "shopping",
      subCategory: "online",
      benefit: "10% cashback on Flipkart for SBI PRIME",
      partnerBrands: ["Flipkart"],
      offerType: "Cashback",
      paymentMode: "Full",
      validFrom: new Date("2024-05-01"),
      validTill: new Date("2025-12-31"),
      tnc: "Valid on Flipkart mobile app orders above ₹1000"
    };

    const result = await Offer.create(testOffer);
    console.log("✅ Test offer inserted:", result);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting test offer:", err.message);
    process.exit(1);
  }
};

run();
