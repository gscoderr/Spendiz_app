import Offer from "../models/offer.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * 🎯 API: POST /api/v1/offers/matching
 * 📦 Returns offers that match user's cards + category + subCategory
 */
export const getMatchingOffers = asyncHandler(async (req, res) => {
  const { cards = [], category, subCategory } = req.body;

  if (!Array.isArray(cards) || cards.length === 0) {
    throw new ApiError(400, "No cards provided for offer matching");
  }

  const today = new Date();

  const conditions = cards.map((card) => {
    if (!card.bank || !card.cardName) return null;

    return {
      bank: { $regex: new RegExp(`^${card.bank.trim()}$`, "i") },
      $or: [
        { cardNames: { $size: 0 } },
        { cardNames: { $exists: false } },
        { cardNames: { $elemMatch: { $regex: new RegExp(`^${card.cardName.trim()}$`, "i") } } }
      ],
      ...(category && { category }),
      ...(subCategory && { subCategory }),
      validTill: { $gte: today }
    };
  }).filter(Boolean); // remove null entries

  if (!conditions.length) {
    throw new ApiError(400, "Valid card data required");
  }

  const offers = await Offer.find({ $or: conditions }).sort({ validTill: 1 });

  res.status(200).json(new ApiResponse(200, offers, "Offers fetched successfully"));
});

/**
 * 🎯 API: GET /api/v1/offers/smartbuy
 * 📦 Returns all SmartBuy offers, sorted by latest
 */
export const getSmartBuyOffers = asyncHandler(async (req, res) => {
  const today = new Date();

  const offers = await Offer.find({
    source: "SmartBuy",
    validTill: { $gte: today }
  }).sort({ scrapedAt: -1 });

  res.status(200).json(new ApiResponse(200, offers, "SmartBuy offers fetched"));
});


// import Offer from "../models/offer.model.js";
// import { asyncHandler } from "../utils/AsyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";

// /**
//  * 🎯 API: POST /api/v1/offers/matching
//  * 📦 Returns offers that match user's cards + category + subCategory
//  */
// export const getMatchingOffers = asyncHandler(async (req, res) => {
//   const { cards = [], category, subCategory } = req.body;

//   if (!Array.isArray(cards) || cards.length === 0) {
//     throw new ApiError(400, "No cards provided for offer matching");
//   }

//   const today = new Date();

//   const conditions = cards.map((card) => {
//     if (!card.bank || !card.cardName) return null;

//     return {
//       bank: { $regex: new RegExp(`^${card.bank.trim()}$`, "i") },
//       $or: [
//         { cardNames: { $size: 0 } },
//         { cardNames: { $exists: false } },
//         { cardNames: { $elemMatch: { $regex: new RegExp(`^${card.cardName.trim()}$`, "i") } } }
//       ],
//       ...(category && { category }),
//       ...(subCategory && { subCategory }),
//       validTill: { $gte: today }
//     };
//   }).filter(Boolean); // remove null entries

//   if (!conditions.length) {
//     throw new ApiError(400, "Valid card data required");
//   }

//   const offers = await Offer.find({ $or: conditions }).sort({ validTill: 1 });

//   res.status(200).json(new ApiResponse(200, offers, "Offers fetched successfully"));
// });

// /**
//  * 🎯 API: GET /api/v1/offers/smartbuy
//  * 📦 Returns all SmartBuy offers, sorted by latest
//  */
// export const getSmartBuyOffers = asyncHandler(async (req, res) => {
//   const today = new Date();

//   const offers = await Offer.find({
//     source: "SmartBuy",
//     validTill: { $gte: today }
//   }).sort({ scrapedAt: -1 });

//   res.status(200).json(new ApiResponse(200, offers, "SmartBuy offers fetched"));
// });

// /**
//  * 🆕 API: POST /api/v1/offers/smartbuy/matching
//  * 🎯 Returns SmartBuy offers filtered by user's cards
//  */
// export const getSmartBuyMatchingOffers = asyncHandler(async (req, res) => {
//   const { cards = [] } = req.body;
//   const category = "Shopping";
//   const subCategory = "SmartBuy";

//   if (!Array.isArray(cards) || cards.length === 0) {
//     throw new ApiError(400, "No cards provided for SmartBuy offer matching");
//   }

//   const today = new Date();

//   const conditions = cards.map((card) => {
//     if (!card.bank || !card.cardName) return null;

//     return {
//       source: "SmartBuy",
//       bank: { $regex: new RegExp(`^${card.bank.trim()}$`, "i") },
//       $or: [
//         { cardNames: { $size: 0 } },
//         { cardNames: { $exists: false } },
//         { cardNames: { $elemMatch: { $regex: new RegExp(`^${card.cardName.trim()}$`, "i") } } }
//       ],
//       category,
//       subCategory,
//       validTill: { $gte: today }
//     };
//   }).filter(Boolean);

//   if (!conditions.length) {
//     throw new ApiError(400, "Valid card data required");
//   }

//   const offers = await Offer.find({ $or: conditions }).sort({ validTill: 1 });

//   res.status(200).json(new ApiResponse(200, offers, "SmartBuy matching offers fetched"));
// });
