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

  const conditions = cards.map((card) => {
    if (!card.bank || !card.cardName) return null;

    return {
      $and: [
        {
          bank: { $regex: new RegExp(`^${card.bank.trim()}$`, "i") }, // bank must match
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

  console.log("🧠 Matching with strict priority on bank and cardName...");
  console.log("🔍 Query conditions:", JSON.stringify(conditions, null, 2));

  const offers = await Offer.find({ $or: conditions }).sort({ validTill: 1 });

  res.status(200).json(new ApiResponse(200, offers, "Strict-matched offers fetched"));
});


// ✅ Get all SmartBuy offers (live + sorted)
export const getSmartBuyOffers = asyncHandler(async (req, res) => {
  const today = new Date();

  const offers = await Offer.find({
    source: "SmartBuy",
    validTill: { $gte: today },
  }).sort({ scrapedAt: -1 });

  res.status(200).json(new ApiResponse(200, offers, "SmartBuy offers fetched"));
});

// ✅ Get all EaseMyTrip offers (public)
export const getEaseMyTripOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ source: "EaseMyTrip" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
