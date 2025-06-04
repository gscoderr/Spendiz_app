// 📁 models/dynamic.model.js
import mongoose from "mongoose";

const dynamicSchema = new mongoose.Schema({
  bankName: String,
  brandPartner: String,
  spendCategory: String,
  subCategory: String,
  offerTitle: String,
  couponCode: String,
  discountPercent: Number,
  maxDiscount: Number,
  minSpend: Number,
  validFrom: Date,
  validTill: Date,
  platform: String,
  daySpecific: String,
  tnc: String,
}, { timestamps: true });

export default mongoose.model("Dynamic", dynamicSchema);