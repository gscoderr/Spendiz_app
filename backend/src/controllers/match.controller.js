


import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Card from "../models/card.model.js";
import CardOffer from "../models/cardoffers.model.js";
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
    const master = testCards.find(
      (c) =>
        c.bank.toLowerCase() === userCard.bank.toLowerCase() &&
        c.cardName.toLowerCase() === userCard.cardName.toLowerCase()
    );

    if (!master || !master[normalizedCategory]) {
      console.log("❌ Skipping: No category found in JSON for", userCard.cardName);
      continue;
    }

    const offers = master[normalizedCategory]; // e.g., master["travel"]


    for (const offer of offers) {
  const subCats = (offer.subCategory || "")
    .toLowerCase()
    .split(",")
    .map((s) => normalizeInput(s.trim()));

  const isMatch = subCats.includes(normalizedSubCategory);
  if (!isMatch) continue;

  const rewardType = offer.cashback ? "cashback" : "reward";
  const rate = parseFloat(offer.cashback ?? offer.rewardRate ?? 0);
  const pointValue = parseFloat(offer.rewardPointValue ?? 0);

  const rawBenefit =
    rewardType === "cashback"
      ? (rate / 100) * spendAmount
      : (rate / 100) * spendAmount * pointValue;

  const benefitValue =
    rewardType === "cashback"
      ? Math.min(rawBenefit, parseFloat(offer.maxLimitCashback) || rawBenefit)
      : Math.min(rawBenefit, parseFloat(offer.maxLimitRewardPoints) || rawBenefit);

  matches.push({
    cardName: master.cardName,
    bank: master.bank,
    network: master.network,
    tier: master.tier,
    rewardType,
    cashback: offer.cashback,
    rewardRate: offer.rewardRate,
    rewardPointValue: offer.rewardPointValue,
    benefitValue,
    benefitDetails: offer.benefit,
    coPartnerBrands: offer.coPartnerBrands,
    tnc: offer.tnc,
    remarks: master.remarks,
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
