import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Card from "../models/card.model.js";
import MasterCard from "../models/mastercards.model.js";
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
    const master = await MasterCard.findOne({
      bank: new RegExp(`^${userCard.bank}$`, "i"),
      cardName: new RegExp(`^${userCard.cardName}$`, "i"),
    });
    if (!master || !master[normalizedCategory]) continue;

    const savedCard = {
      last4Digits: userCard.last4Digits,
      cardHolderName: userCard.cardHolderName,
    };

    const categoryOffers = master[normalizedCategory];

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
        bank: master.bank,
        cardName: master.cardName,
        network: master.network,
        type: master.type,
        tier: master.tier,
        last4Digits: savedCard.last4Digits,
        cardHolderName: savedCard.cardHolderName,

        category: normalizedCategory,
        subCategory: offer.subCategory,
        rewardType: offer.rewardType,
        offers: offer.offers,
        rewardRate,
        rewardPointValue: pointValue,
        cashbackPercent: cashback,
        cashbackPercentValue,
        maxLimitRewardPoints,
        maxLimitCashback,
        benefitDetails: offer.benefit,
        coPartnerBrands: offer.coPartnerBrands,
        tnc: offer.tnc,
        remarks: offer.remarks || master.remarks,

        primaryRewardType: primaryType,
        primaryBenefitValue: parseFloat(primaryValue.toFixed(2)),
        secondaryRewardType: secondary.type,
        secondaryBenefitValue: parseFloat(secondary.value.toFixed(2)),
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

  // Fallback fuzzy suggestion
  const allMasters = await MasterCard.find({});
  const flatSubCategories = allMasters.flatMap((master) => {
    const categoryOffers = master[normalizedCategory] || [];
    return categoryOffers.flatMap((offer) =>
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
