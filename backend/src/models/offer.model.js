// // from this file we can create a model for the dynamic offers collection in the database
// // backend/src/models/offer.model.js

// import mongoose from "mongoose";

// const offerSchema = new mongoose.Schema(
//   {
//     title: { type: String },                     // ✅ Add this (required for SmartBuy)
//     source: { type: String },                    // ✅ Add optional source
//     bank: { type: String, required: true },
//     cardNames: [{ type: String }],
//     category: { type: String },
//     subCategory: { type: String },
//     partnerBrands: [{ type: String }],
//     offerType: { type: String },
//     benefit: { type: String },                   // ✅ Keep optional (was required)
//     minTransaction: { type: Number },
//     paymentMode: { type: String },
//     validFrom: { type: Date },
//     validTill: { type: Date },
//     tnc: { type: String }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Offer", offerSchema);

import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String },                     // e.g. "Clove Dental"
    source: { type: String },                    // e.g. "SmartBuy"
    bank: { type: String, required: true },
    cardNames: [{ type: String }],
    category: { type: String },
    subCategory: { type: String },
    partnerBrands: [{ type: String }],
    offerType: { type: String },                 // e.g. "Discount"
    benefit: { type: String },                   // e.g. "15% off on..."
    minTransaction: { type: Number },
    paymentMode: { type: String },
    validFrom: { type: Date },
    validTill: { type: Date },
    tnc: { type: String },                       // offer link
    image: { type: String },                     // ✅ NEW: offer image
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
