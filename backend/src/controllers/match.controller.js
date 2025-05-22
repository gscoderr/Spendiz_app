// import { asyncHandler } from "../utils/AsyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import Card from "../models/card.model.js";
// import CardOffer from "../models/cardoffers.model.js";
// import Fuse from "fuse.js";

// import { normalizeInput } from "../utils/normalizeInput.js"; // ✅ Step 1: Import normalizer

// export const matchBestCard = asyncHandler(async (req, res) => {
//   const userId = req.user?._id;
//   const { category, subCategory, amount } = req.query;

//   if (!userId) throw new ApiError(401, "Unauthorized");
//   if (!category || !subCategory || !amount) {
//     throw new ApiError(400, "category, subCategory, and amount are required");
//   }

//   const spendAmount = parseFloat(amount);
//   if (isNaN(spendAmount) || spendAmount <= 0) {
//     throw new ApiError(400, "Invalid spend amount");
//   }

//   const normalizedCategory = normalizeInput(category);
//   const normalizedSubCategory = normalizeInput(subCategory);

//   console.log("📥 Match request →", {
//     userId,
//     category,
//     subCategory,
//     normalizedCategory,
//     normalizedSubCategory,
//     spendAmount,
//   });

//   const userCards = await Card.find({ userId });
//   if (!userCards.length) throw new ApiError(404, "No saved cards found");

//   const matches = [];

//   for (const userCard of userCards) {
//     const offers = await CardOffer.find({
//       bank: userCard.bank,
//       cardName: userCard.cardName,
//       spendCategory: { $regex: new RegExp(normalizedCategory, "i") },
//     });

//     for (const offer of offers) {
//       const subCats = (offer.subCategory || "")
//         .toLowerCase()
//         .split(",")
//         .map((s) => normalizeInput(s.trim()));

//       const isSubCategoryMatch = subCats.includes(normalizedSubCategory);
//       if (!isSubCategoryMatch) continue;

//       // ✅ Calculate benefit
//       const rewardType = offer.cashback ? "cashback" : "reward";
//       const rate = offer.cashback ?? offer.rewardRate ?? 0;
//       const pointValue = offer.rewardPointValue ?? 0;

//       const rawBenefit =
//         rewardType === "cashback"
//           ? (rate / 100) * spendAmount
//           : (rate / 100) * spendAmount * pointValue;

//       const benefitValue =
//         rewardType === "cashback"
//           ? Math.min(rawBenefit, offer.maxCashbackLimit || rawBenefit)
//           : Math.min(rawBenefit, offer.maxRewardLimitRP || rawBenefit);

//       matches.push({
//         cardName: offer.cardName,
//         bank: offer.bank,
//         network: offer.network,
//         tier: offer.tier,
//         rewardType,
//         cashback: offer.cashback,
//         rewardRate: offer.rewardRate,
//         rewardPointValue: offer.rewardPointValue,
//         benefitValue,
//         benefitDetails: offer.benefitDetails,
//         coPartnerBrands: offer.coPartnerBrands,
//         tnc: offer.tnc,
//         remarks: offer.remarks,
//       });
//     }
//   }

//   if (matches.length > 0) {
//   const sortedMatches = matches
//     .sort((a, b) => b.benefitValue - a.benefitValue)
//     .slice(0, 5); // top 5

//   return res.status(200).json({
//     success: true,
//     message: "Top matching cards",
//     bestCards: sortedMatches,
//   });
// }


//   // ❓ If no match, suggest fuzzy alternatives
//   const allOffers = await CardOffer.find({});
//   const flatSubCategories = allOffers.flatMap((offer) => {
//     return (offer.subCategory || "")
//       .split(",")
//       .map((sub) => ({
//         subCategory: sub.trim(),
//         bank: offer.bank,
//         cardName: offer.cardName,
//         spendCategory: offer.spendCategory,
//       }));
//   });

//   const fuse = new Fuse(flatSubCategories, {
//     keys: ["subCategory"],
//     threshold: 0.4,
//   });

//   const suggestions = fuse.search(normalizedSubCategory).map((r) => r.item);

//   if (suggestions.length === 0) {
//     throw new ApiError(
//       404,
//       "No matching offers found, and no close suggestions available"
//     );
//   }

//   return res.status(200).json({
//     success: false,
//     message: "No exact match found, but similar suggestions are available",
//     suggestions,
//   });
// });



import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Card from "../models/card.model.js";
import CardOffer from "../models/cardoffers.model.js";
import Fuse from "fuse.js";
import { normalizeInput } from "../utils/normalizeInput.js";

export const matchBestCard = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { category, subCategory, amount } = req.query;

  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!category || !subCategory || !amount) {
    throw new ApiError(400, "category, subCategory, and amount are required");
  }

  const spendAmount = parseFloat(amount);
  if (isNaN(spendAmount) || spendAmount <= 0) {
    throw new ApiError(400, "Invalid spend amount");
  }

  const normalizedCategory = normalizeInput(category);
  const normalizedSubCategory = normalizeInput(subCategory);

  const userCards = await Card.find({ userId });
  if (!userCards.length) throw new ApiError(404, "No saved cards found");

  const matches = [];

  for (const userCard of userCards) {
    const offers = await CardOffer.find({
      bank: userCard.bank,
      cardName: userCard.cardName,
      spendCategory: new RegExp(normalizedCategory, "i"),
    });

    for (const offer of offers) {
      const subCats = (offer.subCategory || "")
        .toLowerCase()
        .split(",")
        .map((s) => normalizeInput(s.trim()));

      if (!subCats.includes(normalizedSubCategory)) continue;

      const rewardType = offer.cashback ? "cashback" : "reward";
      const rate = parseFloat(offer.cashback ?? offer.rewardRate ?? 0);
      const pointValue = parseFloat(offer.rewardPointValue ?? 0);

      const rawBenefit =
        rewardType === "cashback"
          ? (rate / 100) * spendAmount
          : (rate / 100) * spendAmount * pointValue;

      const benefitValue =
        rewardType === "cashback"
          ? Math.min(rawBenefit, offer.maxCashbackLimit || rawBenefit)
          : Math.min(rawBenefit, offer.maxRewardLimitRP || rawBenefit);

      matches.push({
        cardName: offer.cardName,
        bank: offer.bank,
        network: offer.network,
        tier: offer.tier,
        rewardType,
        cashback: offer.cashback,
        rewardRate: offer.rewardRate,
        rewardPointValue: offer.rewardPointValue,
        benefitValue,
        benefitDetails: offer.benefitDetails,
        coPartnerBrands: offer.coPartnerBrands,
        tnc: offer.tnc,
        remarks: offer.remarks,
      });
    }
  }

  if (matches.length > 0) {
    const sortedMatches = matches
      .sort((a, b) => b.benefitValue - a.benefitValue)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      message: "Top matching cards",
      bestCards: sortedMatches,
    });
  }

  // Fuzzy fallback
  const allOffers = await CardOffer.find({});
  const flatSubCategories = allOffers.map((offer) => ({
    subCategory: offer.subCategory,
    bank: offer.bank,
    cardName: offer.cardName,
    spendCategory: offer.spendCategory,
  }));

  const fuse = new Fuse(flatSubCategories, {
    keys: ["subCategory"],
    threshold: 0.4,
  });

  const suggestions = fuse.search(normalizedSubCategory).map((r) => r.item);

  if (!suggestions.length) {
    throw new ApiError(
      404,
      "No matching offers found, and no close suggestions available"
    );
  }

  return res.status(200).json({
    success: false,
    message: "No exact match found, but similar suggestions are available",
    suggestions,
  });
});
