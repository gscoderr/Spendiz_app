import mongoose from "mongoose";

const cardOfferSchema = new mongoose.Schema({
  bank: { type: String, required: true },
  cardName: { type: String, required: true },
  network: String,
  type: String,
  tier: String,

  spendCategory: { type: String, required: true },
  category: String,
  subCategory: String,

  rewardType: String,
  rewardRate: { type: Number, default: 0 },
  cashback: { type: Number, default: 0 },
  rewardPointValue: { type: Number, default: 0 },

  benefitDetails: { type: String, required: true },
  coPartnerBrands: String,
  tnc: String,
  maxRewardLimitRP: { type: Number, default: 0 },
  maxCashbackLimit: { type: Number, default: 0 },
  remarks: String,
}, { timestamps: true });

const CardOffer = mongoose.model("CardOffer", cardOfferSchema);
export default CardOffer;
