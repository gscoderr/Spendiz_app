import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Card from "../models/card.model.js";
import CardOffer from "../models/mastercards.model.js";
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
    const master = await CardOffer.findOne({
      bank: new RegExp(`^${userCard.bank}$`, "i"),
      cardName: new RegExp(`^${userCard.cardName}$`, "i"),
    });

    if (!master || !master[normalizedCategory]) continue;

    const categoryOffers = master[normalizedCategory];

    for (const offer of categoryOffers) {
      const subCats = (offer.subCategory || "")
        .toLowerCase()
        .split(",")
        .map((s) => normalizeInput(s.trim()));

      if (!subCats.includes(normalizedSubCategory)) continue;

      const rewardType = offer.cashback ? "cashback" : "reward points";
      const rate = parseFloat(offer.cashback ?? offer.rewardRate ?? 0);
      const pointValue = parseFloat(offer.rewardPointValue ?? 0);

      const rawBenefit =
        rewardType === "cashback"
          ? (rate / 100) * spendAmount
          : (rate / 100) * spendAmount * pointValue;

      const benefitValue =
        rewardType === "cashback"
          ? Math.min(rawBenefit, offer.maxLimitCashback || rawBenefit)
          : Math.min(rawBenefit, offer.maxLimitRewardPoints || rawBenefit);

      matches.push({
        bank: master.bank,
        cardName: master.cardName,
        network: master.network,
        type: master.type,
        tier: master.tier,
        category: normalizedCategory,
        subCategory: offer.subCategory,
        rewardType,
        offers: offer.offers,
        rewardRate: offer.rewardRate,
        rewardPointValue: offer.rewardPointValue,
        cashbackPercent: offer.cashback,
        cashbackValue: rewardType === "cashback" ? benefitValue : 0,
        benefitDetails: offer.benefitDetails,
        coPartnerBrands: offer.coPartnerBrands,
        tnc: offer.tnc,
        maxLimitRewardPoints: offer.maxLimitRewardPoints,
        maxLimitCashback: offer.maxLimitCashback,
        remarks: master.remarks,
        benefitValue, // total value for sorting
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

  // Fuzzy suggestions
  const allMasters = await CardOffer.find({});
  const flatSubCategories = allMasters.flatMap((master) => {
    const categoryOffers = master[normalizedCategory] || [];
    return categoryOffers.flatMap((offer) =>
      (offer.subCategory || "")
        .split(",")
        .map((sub) => ({
          subCategory: sub.trim(),
          bank: master.bank,
          cardName: master.cardName,
          spendCategory: normalizedCategory,
        }))
    );
  });

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
