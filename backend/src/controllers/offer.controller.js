import Offer from "../models/offer.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ Updated Strict Match: also supports bank: 'Various' and cardNames: []
export const getMatchingOffers = asyncHandler(async (req, res) => {
  const { cards = [], category, subCategory } = req.body;

  if (!Array.isArray(cards) || cards.length === 0) {
    throw new ApiError(400, "No cards provided for offer matching");
  }

  const today = new Date();

  // 📋 Show all received user cards
  console.log("👤 Received User Cards for Matching:");
  cards.forEach((card) => {
    console.log(`- ${card.bank} | ${card.cardName}`);
  });

  const conditions = cards.map((card) => {
    if (!card.bank || !card.cardName) return null;

    return {
      $and: [
        {
          bank: { $regex: new RegExp(`^${card.bank.trim()}$`, "i") },
        },
        {
          $or: [
            { cardNames: { $elemMatch: { $regex: new RegExp(`^${card.cardName.trim()}$`, "i") } } },
            { cardNames: { $exists: false } },
            { cardNames: { $size: 0 } },
          ],
        },
        ...(category ? [{ category }] : []),
        ...(subCategory ? [{ subCategory }] : []),
        { validTill: { $gte: today } },
      ],
    };
  }).filter(Boolean);

  if (!conditions.length) {
    throw new ApiError(400, "Valid card data required");
  }

  // 🧠 Debug log for conditions
  console.log("🔍 MongoDB Conditions:");
  console.dir(conditions, { depth: null });

  // ✅ Match offers using OR of all conditions
 const offers = await Offer.find({ $or: conditions }).sort({ validTill: 1 });

// ✅ Log: Total and Unique Banks
const bankList = offers.map((o) => o.bank?.trim()).filter(Boolean);
const uniqueBanks = [...new Set(bankList)];

console.log("✅ Total Matched Offers:", offers.length);
console.log("🏦 Banks in Offers:", uniqueBanks);

offers.forEach((offer) => {
  const cards = offer.cardNames?.length > 0 ? offer.cardNames.join(", ") : "All Cards";
  console.log(`➡️ ${offer.bank} | ${cards}`);
});


  res.status(200).json(new ApiResponse(200, offers, "Strict-matched offers fetched"));
});

// ✅ Get all SmartBuy offers
export const getSmartBuyOffers = asyncHandler(async (req, res) => {
  const today = new Date();

  const offers = await Offer.find({
    source: "SmartBuy",
    validTill: { $gte: today },
  }).sort({ scrapedAt: -1 });

  res.status(200).json(new ApiResponse(200, offers, "SmartBuy offers fetched"));
});

// ✅ Get all EaseMyTrip offers
export const getEaseMyTripOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ source: "EaseMyTrip" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ NEW: Get all offers (SmartBuy + EMT + ICICI + more)
export const getAllOffers = asyncHandler(async (req, res) => {
  const today = new Date();
  const offers = await Offer.find({
    validTill: { $gte: today },
  }).sort({ scrapedAt: -1 });

  res.status(200).json(new ApiResponse(200, offers, "All offers fetched"));
});
