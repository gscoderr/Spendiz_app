import mongoose from "mongoose";
import fs from "fs";
import CardOffer from "../models/cardoffers.model.js";


const MONGO_URI = "";


const run = async () => {
  await mongoose.connect(MONGO_URI);
  const cards = JSON.parse(fs.readFileSync("mastercards_formatted.json", "utf-8"));

  const flattenedOffers = [];

  for (const card of cards) {
    if (!card.offers || !Array.isArray(card.offers)) continue;

    for (const offer of card.offers) {
      flattenedOffers.push({
        // Optional: you can include a cardId if you're referencing mastercards later
        bank: card.bank,
        cardName: card.cardName,
        network: card.network,
        tier: card.tier,
        type: card.type,
        ...offer
      });
    }
  }

  await CardOffer.insertMany(flattenedOffers);
  console.log(`✅ Inserted ${flattenedOffers.length} offers into cardoffers`);
};
run();
