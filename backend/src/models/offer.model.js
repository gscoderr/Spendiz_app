// backend/src/models/offer.model.js

import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String },
    source: { type: String },
    bank: { type: String, required: true },
    cardNames: [{ type: String }],
    category: { type: String },
    subCategory: { type: String },
    partnerBrands: [{ type: String }],
    offerType: { type: String },
    benefit: { type: String },
    discountValue: { type: Number, default: 0 },
    minTransaction: { type: Number },
    paymentMode: { type: String },
    promoCode: { type: String, default: "" },
    validFrom: { type: Date },
    validTill: { type: Date },
    tnc: { type: String },
    image: { type: String },
    scrapedAt: { type: Date, default: Date.now },
    domTree: { type: mongoose.Schema.Types.Mixed } // ✅ new field
  },
  { timestamps: true }
);


export default mongoose.model("Offer", offerSchema);
