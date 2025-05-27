import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Card from "../models/card.model.js";
import CardOffer from "../models/mastercards.model.js";
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
    const normalizedBank = normalizeInput(userCard.bank);
    const normalizedCardName = normalizeInput(userCard.cardName);

    const master = await CardOffer.findOne({
      $expr: {
        $and: [
          { $eq: [{ $toLower: "$bank" }, normalizedBank] },
          { $eq: [{ $toLower: "$cardName" }, normalizedCardName] },
        ],
      },
    });

    if (!master || !master[normalizedCategory]) {
      console.log(`❌ No match for: ${userCard.bank} - ${userCard.cardName}`);
      continue;
    }

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
        cashbackBenefitValue: rewardType === "cashback" ? benefitValue : 0,
        rewardBenefitValue: rewardType === "reward points" ? benefitValue : 0,
        totalBenefitValue: benefitValue,
        benefitDetails: offer.benefit || offer.benefitDetails || "",
        coPartnerBrands: offer.coPartnerBrands || [],
        tnc: offer.tnc || "",
        maxLimitRewardPoints: offer.maxLimitRewardPoints || 0,
        maxLimitCashback: offer.maxLimitCashback || 0,
        remarks: master.remarks || "",
        last4Digits: userCard.last4Digits,
        cardHolderName: userCard.cardHolderName,
      });
    }
  }

  if (matches.length > 0) {
    const sortedMatches = matches
      .sort((a, b) => b.totalBenefitValue - a.totalBenefitValue)
      .slice(0, 5);

    // Also prepare additional suggestions
    const allMasters = await CardOffer.find({});
    const suggestionPool = [];

    for (const master of allMasters) {
      const categoryOffers = master[normalizedCategory] || [];
      for (const offer of categoryOffers) {
        const subCats = (offer.subCategory || "")
          .toLowerCase()
          .split(",")
          .map((s) => normalizeInput(s.trim()));

        if (subCats.includes(normalizedSubCategory)) {
          suggestionPool.push({
            bank: master.bank,
            cardName: master.cardName,
            subCategory: offer.subCategory,
            coPartnerBrands: offer.coPartnerBrands || [],
            benefitDetails: offer.benefit || offer.benefitDetails || "",
            tnc: offer.tnc || "",
            remarks: master.remarks || "",
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Top matching cards",
      bestCards: sortedMatches,
      suggestions: suggestionPool, // ✅ add this even with success
    });
  }

  // ✅ Other unmatched offers from all cards (same category + subcategory)
  const allMasters = await CardOffer.find({});
  const suggestionPool = [];

  for (const master of allMasters) {
    const categoryOffers = master[normalizedCategory] || [];
    for (const offer of categoryOffers) {
      const subCats = (offer.subCategory || "")
        .toLowerCase()
        .split(",")
        .map((s) => normalizeInput(s.trim()));

      if (subCats.includes(normalizedSubCategory)) {
        suggestionPool.push({
          bank: master.bank,
          cardName: master.cardName,
          subCategory: offer.subCategory,
          coPartnerBrands: offer.coPartnerBrands || [],
          benefitDetails: offer.benefit || offer.benefitDetails || "",
          tnc: offer.tnc || "",
          remarks: master.remarks || "",
        });
      }
    }
  }

  if (!suggestionPool.length) {
    throw new ApiError(
      404,
      "No matching offers found, and no close suggestions available"
    );
  }

  return res.status(200).json({
    success: false,
    message: "No exact match found, but here are some offers",
    suggestions: suggestionPool,
  });
});
