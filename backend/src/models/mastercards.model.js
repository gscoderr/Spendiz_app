// 📁 backend/src/models/mastercards.model.js
import mongoose from "mongoose";

const masterCardSchema = new mongoose.Schema({
  bank: String,
  cardName: String,
  network: String,
  tier: String,
  type: [String],
  spendCategory: String,
  shopping: [Object]
}, { timestamps: true });

export default mongoose.model("MasterCard", masterCardSchema, "mastercards");
