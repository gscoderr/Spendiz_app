import mongoose from "mongoose";
import fs from "fs";
import CardOffer from "../models/cardoffers.model.js";


const MONGO_URI = "";

const run = async () => {
  await mongoose.connect(MONGO_URI);
  const data = JSON.parse(fs.readFileSync("cleaned_hdfc_cards.json", "utf-8"));

  await CardOffer.insertMany(data);
  console.log("✅ Inserted HDFC offers into cardoffers collection");


  mongoose.disconnect();
};

run();
