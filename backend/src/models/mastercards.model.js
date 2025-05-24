// 📁 backend/src/models/mastercards.model.js

import mongoose from "mongoose";

// Embedded schema for each category benefit
const benefitSchema = new mongoose.Schema(
  {
    subCategory: { type: String, required: true },
    rewardType: {
      type: String,
      enum: ["cashback", "reward points"],
      required: true,
    },
    offers: { type: String }, // New field added
    rewardRate: { type: Number, default: 0 },
    rewardPointValue: { type: Number, default: 0 }, // New field added
    cashback: { type: Number, default: 0 },
    benefitDetails: { type: String }, // Renamed from "benefit" for clarity
    coPartnerBrands: [{ type: String }],
    tnc: { type: String },
    maxLimitRewardPoints: { type: Number },
    maxLimitCashback: { type: Number },
  },
  { _id: false }
);

// MasterCard schema
const masterCardSchema = new mongoose.Schema(
  {
    bank: { type: String, required: true },
    cardName: { type: String, required: true },
    network: { type: String },
    type: [{ type: String }], // e.g. ["Credit"]
    tier: { type: String },

    // Spend categories with benefit arrays
    shopping: [benefitSchema],
    travel: [benefitSchema],
    dining: [benefitSchema],
    fuel: [benefitSchema],
    entertainment: [benefitSchema],

    // Optional top-level categories
    spendCategory: { type: String },
    otherPerks: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("MasterCard", masterCardSchema, "mastercards");
