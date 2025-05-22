// // 📁 backend/src/models/mastercards.model.js
// import mongoose from "mongoose";

// const masterCardSchema = new mongoose.Schema({
//   bank: String,
//   cardName: String,
//   network: String,
//   tier: String,
//   type: [String],
//   spendCategory: String,
//   shopping: [Object]
// }, { timestamps: true });

// export default mongoose.model("MasterCard", masterCardSchema, "mastercards");


import mongoose from "mongoose";

// Embedded schema for each category benefit (e.g., shopping, travel, dining)
const benefitSchema = new mongoose.Schema({
  subCategory: { type: String, required: true },
  rewardType: {
    type: String,
    enum: ['cashback', 'reward points'],
    required: true,
  },
  rewardRate: { type: Number, default: 0 },
  cashback: { type: Number, default: 0 },
  benefit: { type: String },
  coPartnerBrands: [String],
  tnc: { type: String },
  maxLimitRewardPoints: { type: Number },
  maxLimitCashback: { type: Number },
}, { _id: false });

// MasterCard schema
const masterCardSchema = new mongoose.Schema({
  bank: { type: String, required: true },
  cardName: { type: String, required: true },
  network: { type: String },
  tier: { type: String },
  type: [String], // e.g. ["shopping", "travel"]
  spendCategory: { type: String }, // optional top-level category

  shopping: [benefitSchema],
  travel: [benefitSchema],
  dining: [benefitSchema],
  fuel: [benefitSchema],
  entertainment: [benefitSchema],

  otherPerks: { type: String },
  remarks: { type: String },
}, { timestamps: true });

export default mongoose.model("MasterCard", masterCardSchema, "mastercards");
