// 📍 backend/src/controllers/card.controller.js
import Card from '../models/card.model.js';
import MasterCard from '../models/mastercards.model.js'; // Just to read dropdown values
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const addCard = asyncHandler(async (req, res) => {
  const { bank, cardName, network, tier, last4Digits, cardHolderName } = req.body;

  if (!bank || !cardName || !network || !tier || !last4Digits || !cardHolderName) {
    throw new ApiError(400, 'All fields are required');
  }


  const exists = await Card.findOne({
    userId: req.user._id,
    bank,
    cardName,
    last4Digits
  });

  if (exists) {
    throw new ApiError(409, "This card already exists in your account.");
  }

  const newCard = await Card.create({
    bank,
    userId: req.user?._id, // optional
    cardName,
    network,
    tier,
    last4Digits,
    cardHolderName,
  });

  return res.status(201).json(new ApiResponse(201, newCard, 'Card saved successfully'));
});

export const getBanks = asyncHandler(async (req, res) => {
  const banks = await MasterCard.distinct("bank");

  return res.status(200).json(banks);
});


export const getCardNames = asyncHandler(async (req, res) => {
  const { bank } = req.query;
  if (!bank) throw new ApiError(400, "Bank is required");

  const cardNames = await MasterCard.find({ bank }).distinct("cardName");
  return res.status(200).json(cardNames);
});

export const getCardDetails = asyncHandler(async (req, res) => {
  const { bank, cardName } = req.query;
  if (!bank || !cardName) throw new ApiError(400, "Bank and Card Name required");

  const card = await MasterCard.findOne({ bank, cardName });
  if (!card) throw new ApiError(404, "Card not found");

  return res.status(200).json({
    network: card.network,
    tier: card.tier
  });
});

export const getUserCards = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cards = await Card.find({ userId }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, cards, "User cards fetched"));
});


export const matchBestCard = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { category, subCategory, amount } = req.query;

  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!category || !subCategory || !amount) {
    throw new ApiError(400, "category, subCategory, and amount are required");
  }

  console.log("🚀 /match/best-card route hit");
  console.log("👉 Query Params:", req.query);
  console.log("🔐 User ID:", req.user?._id);
  
  const spendAmount = parseFloat(amount);
  if (isNaN(spendAmount) || spendAmount <= 0) {
    throw new ApiError(400, "Invalid spend amount");
  }

  const userCards = await Card.find({ userId });
  if (!userCards.length) throw new ApiError(404, "No cards saved by user");

  const masterCards = await MasterCard.find();
  if (!masterCards.length) throw new ApiError(500, "MasterCard data not available");

  const matches = [];

  for (const userCard of userCards) {
    const matchedMaster = masterCards.find(
      (m) =>
        m.bank?.toLowerCase().trim() === userCard.bank?.toLowerCase().trim() &&
        m.cardName?.toLowerCase().trim() === userCard.cardName?.toLowerCase().trim()
    );

    if (!matchedMaster || !matchedMaster[category]) continue;

    const matchedOffers = matchedMaster[category].filter(
      (offer) =>
        offer.subCategory?.toLowerCase().trim() === subCategory?.toLowerCase().trim()
    );

    if (!matchedOffers.length) continue;

    const offer = matchedOffers[0];
    const rewardType = typeof offer.cashback === "number" ? "cashback" : "reward";
    const rate = offer.cashback ?? offer.rewardRate ?? 0;

    const rawBenefit = (spendAmount * rate) / 100;

    const benefitValue =
      rewardType === "cashback"
        ? Math.min(rawBenefit, offer.maxLimitCashback || rawBenefit)
        : Math.min(rawBenefit, offer.maxLimitRewardPoints || rawBenefit);

    matches.push({
      cardName: matchedMaster.cardName,
      bank: matchedMaster.bank,
      rewardType,
      cashback: offer.cashback,
      rewardRate: offer.rewardRate,
      benefitValue,
      loungeAccess: matchedMaster.loungeAccess,
      fuelBenefit: matchedMaster.fuelBenefit,
      milestone: matchedMaster.milestone,
      otherPerks: matchedMaster.otherPerks,
      tnc: matchedMaster.tnc,
      remarks: matchedMaster.remarks,
    });
  }

  if (!matches.length) {
    throw new ApiError(404, "No matching card offers found");
  }

  const bestCard = matches.reduce((a, b) =>
    a.benefitValue > b.benefitValue ? a : b
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      { bestCard, allMatches: matches },
      "Best card match found"
    )
  );
});
