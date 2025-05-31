// backend/src/models/offer.model.js

import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String },                      // e.g. "EaseMyTrip"
    source: { type: String },                     // e.g. "SmartBuy", "Goibibo"
    bank: { type: String, required: true },       // e.g. "ICICI", "HDFC"
    cardNames: [{ type: String }],
    category: { type: String },                   // e.g. "Travel", "Shopping"
    subCategory: { type: String },                // e.g. "Flights", "Dining"
    partnerBrands: [{ type: String }],
    offerType: { type: String },                  // e.g. "Cashback", "Discount"
    benefit: { type: String },                    // full offer string
    discountValue: { type: Number, default: 0 },  // ✅ NEW – numeric value of benefit
    minTransaction: { type: Number },
    paymentMode: { type: String },                // e.g. "Full", "EMI"
    promoCode: { type: String, default: "" },     // ✅ NEW – for frontend copy button
    validFrom: { type: Date },
    validTill: { type: Date },
    tnc: { type: String },                        // offer terms URL
    image: { type: String },                      // ✅ NEW – offer card image
    scrapedAt: { type: Date, default: Date.now }  // ✅ NEW – helpful for refreshing / cron
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
