// // // 📁 backend/src/models/mastercards.model.js
// // import mongoose from "mongoose";

// // const masterCardSchema = new mongoose.Schema({
// //   bank: String,
// //   cardName: String,
// //   network: String,
// //   tier: String,
// //   type: [String],
// //   spendCategory: String,
// //   shopping: [Object]
// // }, { timestamps: true });

// // export default mongoose.model("MasterCard", masterCardSchema, "mastercards");


// import mongoose from "mongoose";

// // Embedded schema for each category benefit (e.g., shopping, travel, dining)
// const benefitSchema = new mongoose.Schema({
//   subCategory: { type: String, required: true },
//   rewardType: {
//     type: String,
//     enum: ['cashback', 'reward points'],
//     required: true,
//   },
//   rewardRate: { type: Number, default: 0 },
//   cashback: { type: Number, default: 0 },
//   benefit: { type: String },
//   coPartnerBrands: [String],
//   tnc: { type: String },
//   maxLimitRewardPoints: { type: Number },
//   maxLimitCashback: { type: Number },
// }, { _id: false });

// // MasterCard schema
// const masterCardSchema = new mongoose.Schema({
//   bank: { type: String, required: true },
//   cardName: { type: String, required: true },
//   network: { type: String },
//   tier: { type: String },
//   type: [String], // e.g. ["shopping", "travel"]
//   spendCategory: { type: String }, // optional top-level category

//   shopping: [benefitSchema],
//   travel: [benefitSchema],
//   dining: [benefitSchema],
//   fuel: [benefitSchema],
//   entertainment: [benefitSchema],

//   otherPerks: { type: String },
//   remarks: { type: String },
// }, { timestamps: true });

// export default mongoose.model("MasterCard", masterCardSchema, "mastercards");



import mongoose from "mongoose";

// Embedded schema for each category benefit (e.g., shopping, travel, etc.)
const benefitSchema = new mongoose.Schema({
  subCategory: { type: String, required: true },                   // Sub-Category
  rewardType: { type: String },                                    // Reward Type
  offers: { type: String },                                        // Offers
  rewardRate: { type: Number, default: 0 },                        // Reward Rate
  rewardPointValue: { type: Number, default: 0 },                  // Reward Point Value (₹)
  cashback: { type: Number, default: 0 },                          // Cashback (%)
  cashbackPercentValue: { type: Number, default: 0 },              // Cashback (%) Value
  benefit: { type: String },                                       // Benefit Details
  coPartnerBrands: { type: String },                               // Co-Partner Brands
  tnc: { type: String },                                           // Terms & Conditions
  maxLimitRewardPoints: { type: Number },                          // Max Reward Limit (RP)
  maxLimitCashback: { type: Number },                              // Max Cashback Limit (₹)
  remarks: { type: String }                                        // Remarks
}, { _id: false });

// MasterCard schema (top-level card details)
const masterCardSchema = new mongoose.Schema({
  bank: { type: String, required: true },                          // Bank Name
  cardName: { type: String, required: true },                      // Card Name
  network: { type: String },                                       // Network
  tier: { type: String },                                          // Tier
  type: [String],                                                  // Type (e.g., ["Credit"])
  spendCategory: { type: String },                                 // Optional top-level category

  shopping: [benefitSchema],
  travel: [benefitSchema],
  dining: [benefitSchema],
  fuel: [benefitSchema],
  entertainment: [benefitSchema],

  otherPerks: { type: String },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.model("MasterCard", masterCardSchema, "mastercards");
