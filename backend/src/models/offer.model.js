// from this file we can create a model for the dynamic offers collection in the database
// backend/src/models/offer.model.js

import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    bank: { type: String, required: true },
    cardNames: [{ type: String }], // optional
    category: { type: String },
    subCategory: { type: String },
    partnerBrands: [{ type: String }],
    offerType: { type: String }, // Cashback / Discount / Extra Rewards
    benefit: { type: String, required: true },
    minTransaction: { type: Number },
    paymentMode: { type: String }, // Full / EMI
    validFrom: { type: Date },
    validTill: { type: Date },
    tnc: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
