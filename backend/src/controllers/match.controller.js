// import { asyncHandler } from "../utils/AsyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import Card from "../models/card.model.js";
// // import CardOffer from "../models/cardoffers.model.js";
// import CardOffer from "../models/mastercards.model.js";
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





// // import { asyncHandler } from "../utils/AsyncHandler.js";
// // import { ApiError } from "../utils/ApiError.js";
// // import Card from "../models/card.model.js";
// // import MasterCard from "../models/mastercards.model.js";
// // import Fuse from "fuse.js";
// // import { findSubCategoryKey } from "../utils/normalizeByCategory.js"; // category-wise matching

// // export const matchBestCard = asyncHandler(async (req, res) => {
// //   const userId = req.user?._id;
// //   const { category, subCategory, amount } = req.query;

// //   if (!userId) throw new ApiError(401, "Unauthorized");
// //   if (!category || !subCategory || !amount) {
// //     throw new ApiError(400, "category, subCategory, and amount are required");
// //   }

// //   const spendAmount = parseFloat(amount);
// //   if (isNaN(spendAmount) || spendAmount <= 0) {
// //     throw new ApiError(400, "Invalid spend amount");
// //   }

// //   const cleanedCategory = category.toLowerCase().trim();
// //   const resolvedSubCategory = findSubCategoryKey(cleanedCategory, subCategory);

// //   console.log("📥 Matching from mastercards →", {
// //     userId,
// //     category,
// //     subCategory,
// //     resolvedSubCategory,
// //     spendAmount,
// //   });

// //   const userCards = await Card.find({ userId });
// //   if (!userCards.length) throw new ApiError(404, "No saved cards found");

// //   const matches = [];

// //   for (const userCard of userCards) {
// //     // Case-insensitive matching
// //     const master = await MasterCard.findOne({
// //       bank: new RegExp(`^${userCard.bank}$`, "i"),
// //       cardName: new RegExp(`^${userCard.cardName}$`, "i"),
// //     });

// //     if (!master) {
// //       console.log("❌ No master found for:", userCard.bank, userCard.cardName);
// //       continue;
// //     }

// //     if (!master[cleanedCategory]) {
// //       console.log("❌ MasterCard found but no category:", cleanedCategory, "in", master.cardName);
// //       continue;
// //     }

// //     const offers = master[cleanedCategory];

// //     for (const offer of offers) {
// //       const subCats = (offer.subCategory || "")
// //         .toLowerCase()
// //         .split(",")
// //         .map((s) => s.trim());

// //       const isMatch = subCats.includes(resolvedSubCategory);
// //       if (!isMatch) continue;

// //       const rewardType = offer.cashback ? "cashback" : "reward";
// //       const rate = parseFloat(offer.cashback ?? offer.rewardRate ?? 0);
// //       const pointValue = parseFloat(offer.rewardPointValue ?? 0);

// //       const rawBenefit =
// //         rewardType === "cashback"
// //           ? (rate / 100) * spendAmount
// //           : (rate / 100) * spendAmount * pointValue;

// //       const benefitValue =
// //         rewardType === "cashback"
// //           ? Math.min(rawBenefit, parseFloat(offer.maxLimitCashback) || rawBenefit)
// //           : Math.min(rawBenefit, parseFloat(offer.maxLimitRewardPoints) || rawBenefit);

// //       matches.push({
// //         cardName: master.cardName,
// //         bank: master.bank,
// //         network: master.network,
// //         tier: master.tier,
// //         rewardType,
// //         cashback: offer.cashback,
// //         rewardRate: offer.rewardRate,
// //         rewardPointValue: offer.rewardPointValue,
// //         benefitValue,
// //         benefitDetails: offer.benefit,
// //         coPartnerBrands: offer.coPartnerBrands,
// //         tnc: offer.tnc,
// //         remarks: master.remarks,
// //         subCategory: offer.subCategory,
// //         category: master.category || cleanedCategory
// //       });
// //     }
// //   }

// //   if (matches.length > 0) {
// //     const sortedMatches = matches
// //       .sort((a, b) => b.benefitValue - a.benefitValue)
// //       .slice(0, 5);

// //     return res.status(200).json({
// //       success: true,
// //       message: "Top matching cards",
// //       bestCards: sortedMatches,
// //     });
// //   }

// //   // 🧠 Fuzzy fallback if no exact match
// //   const allMasters = await MasterCard.find({});
// //   const flatSubCategories = allMasters.flatMap((master) => {
// //     const categoryOffers = master[cleanedCategory] || [];
// //     return categoryOffers.flatMap((offer) =>
// //       (offer.subCategory || "")
// //         .split(",")
// //         .map((sub) => ({
// //           subCategory: sub.trim(),
// //           bank: master.bank,
// //           cardName: master.cardName,
// //           spendCategory: cleanedCategory,
// //         }))
// //     );
// //   });

// //   const fuse = new Fuse(flatSubCategories, {
// //     keys: ["subCategory"],
// //     threshold: 0.4,
// //   });

// //   const suggestions = fuse.search(resolvedSubCategory).map((r) => r.item);

// //   if (!suggestions.length) {
// //     throw new ApiError(
// //       404,
// //       "No matching offers found, and no close suggestions available"
// //     );
// //   }

// //   return res.status(200).json({
// //     success: false,
// //     message: "No exact match found, but similar suggestions are available",
// //     suggestions,
// //   });
// // });


import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Card from "../models/card.model.js";
import CardOffer from "../models/mastercards.model.js";
import Fuse from "fuse.js";

import { normalizeInput } from "../utils/normalizeInput.js";

import testCards from "../seed/sample_mastercards_10cards.json" assert { type: "json" };

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
    const master = await CardOffer.findOne({
      bank: new RegExp(`^${userCard.bank}$`, "i"),
      cardName: new RegExp(`^${userCard.cardName}$`, "i"),
    });
    if (!master || !master[normalizedCategory]) continue;

    const categoryOffers = master[normalizedCategory]; // e.g., master["shopping"]

    for (const offer of categoryOffers) {
      const subCats = (offer.subCategory || "")
        .toLowerCase()
        .split(",")
        .map((s) => normalizeInput(s.trim()));

  const isMatch = subCats.includes(normalizedSubCategory);
  if (!isMatch) continue;

      // Core fields from offer
      const cashback = parseFloat(offer.cashback ?? 0);
      const cashbackPercentValue = parseFloat(offer.cashbackPercentValue ?? 0);
      const rewardRate = parseFloat(offer.rewardRate ?? 0);
      const pointValue = parseFloat(offer.rewardPointValue ?? 0);
      const maxLimitCashback = parseFloat(offer.maxLimitCashback ?? 0);
      const maxLimitRewardPoints = parseFloat(offer.maxLimitRewardPoints ?? 0);

      // Calculate rewards
      const earnedCashback = cashback ? (cashback / 100) * spendAmount : 0;
      const earnedRewardPoints = rewardRate ? (rewardRate / 100) * spendAmount : 0;
      const earnedRewardValue = earnedRewardPoints * pointValue;

      const cappedCashback = maxLimitCashback > 0 ? Math.min(earnedCashback, maxLimitCashback) : earnedCashback;
      const cappedReward = maxLimitRewardPoints > 0 ? Math.min(earnedRewardValue, maxLimitRewardPoints) : earnedRewardValue;

      let primaryType = "reward points";
      let primaryValue = cappedReward;
      let secondary = { type: "cashback", value: cappedCashback };

      if (cappedCashback > cappedReward) {
        primaryType = "cashback";
        primaryValue = cappedCashback;
        secondary = { type: "reward points", value: cappedReward };
      }

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
        maxLimitRewardPoints: offer.maxLimitRewardPoints,
        maxLimitCashback: offer.maxLimitCashback,
        remarks: master.remarks,
        benefitValue, // total value for sorting
        cardHolderName: userCard.cardHolderName,
        last4Digits: userCard.last4Digits,
      });
    }
  }

  if (matches.length > 0) {
    const sorted = matches.sort((a, b) => b.primaryBenefitValue - a.primaryBenefitValue).slice(0, 5);
    return res.status(200).json({
      success: true,
      message: "Top matching cards",
      bestCards: sorted,
    });
  }

  // Fuzzy suggestions
  const allMasters = await CardOffer.find({});
  const flatSubCategories = allMasters.flatMap((master) => {
    const categoryOffers = master[normalizedCategory] || [];
    return categoryOffers.flatMap((offer) =>
      (offer.subCategory || "").split(",").map((sub) => ({
        subCategory: sub.trim(),
        bank: master.bank,
        cardName: master.cardName,
        spendCategory: normalizedCategory,
      }))
      (offer.subCategory || "").split(",").map((sub) => ({
        subCategory: sub.trim(),
        bank: master.bank,
        cardName: master.cardName,
        spendCategory: normalizedCategory,
      }))
    );
  });

  const fuse = new Fuse(flatSubCategories, { keys: ["subCategory"], threshold: 0.4 });
  const suggestions = fuse.search(normalizedSubCategory).map((r) => r.item);

  if (!suggestions.length) {
    throw new ApiError(404, "No matching offers found, and no close suggestions available");
  }

  return res.status(200).json({
    success: false,
    message: "No exact match found, but similar suggestions are available",
    suggestions,
  });
});
