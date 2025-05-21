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

export const deleteCard = asyncHandler(async (req, res) => {
  const cardId = req.params.id;
  const userId = req.user?._id;

  if (!cardId) {
    throw new ApiError(400, "Card ID is required");
  }

  const card = await Card.findOne({ _id: cardId, userId });

  if (!card) {
    throw new ApiError(404, "Card not found or unauthorized");
  }

  await Card.deleteOne({ _id: cardId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Card deleted successfully"));
});

