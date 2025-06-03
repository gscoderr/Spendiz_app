// 📁 controllers/combined.controller.js
import Offer from "../models/offer.model.js";
import MasterCard from "../models/mastercards.model.js";
import Card from "../models/card.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// 🧠 Utility to normalize string
const normalize = (str) => str?.trim()?.toLowerCase();

export const getCombinedOffers = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { category, subCategory } = req.body;

  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!category) throw new ApiError(400, "Category is required");

  const today = new Date();

  // Step 1: Get saved cards
  const userCards = await Card.find({ userId });
  if (!userCards.length) throw new ApiError(400, "No saved cards found");

  // Step 2: Dynamic offer query
  const dynamicConditions = userCards.map((card) => {
    if (!card.bank || !card.cardName) return null;
    return {
      bank: { $regex: new RegExp(`^${card.bank}$`, "i") },
      $or: [
        { cardNames: { $size: 0 } },
        { cardNames: { $exists: false } },
        { cardNames: { $elemMatch: { $regex: new RegExp(`^${card.cardName}$`, "i") } } },
      ],
      ...(subCategory && { subCategory }),
      category,
      validTill: { $gte: today },
    };
  }).filter(Boolean);

  const dynamicOffers = await Offer.find({ $or: dynamicConditions }).sort({ validTill: 1 });

  // Log dynamic offers
  console.log("🔵 Dynamic Offers Fetched:", dynamicOffers.length);
  console.dir(dynamicOffers, { depth: null });

  // Step 3: Static offers
  const staticMatches = [];

  for (const card of userCards) {
    const match = await MasterCard.findOne({
      bank: { $regex: new RegExp(`^${card.bank}$`, "i") },
      cardName: { $regex: new RegExp(`^${card.cardName}$`, "i") },
    });

    if (match && Array.isArray(match[category.toLowerCase()])) {
      const categoryOffers = match[category.toLowerCase()] || [];
      const filtered = subCategory
        ? categoryOffers.filter((o) => normalize(o.subCategory) === normalize(subCategory))
        : categoryOffers;

      filtered.forEach((offer) => {
        staticMatches.push({
          _id: `${match._id}_${offer.subCategory}`,
          source: "MasterCard",
          bank: match.bank,
          cardName: match.cardName,
          category,
          subCategory: offer.subCategory,
          benefit: offer.benefit,
          rewardRate: offer.rewardRate,
          cashback: offer.cashback,
          tnc: offer.tnc,
          validTill: new Date("2099-12-31"),
          image: "",
          title: offer.title || `${match.cardName} Benefit`,
        });
      });
    }
  }

  // Log static offers
  console.log("🟢 Static Offers Fetched from mastercards:", staticMatches.length);
  console.dir(staticMatches, { depth: null });

  // Combine both
  const allOffers = [...dynamicOffers, ...staticMatches];

  res.status(200).json(new ApiResponse(200, allOffers, "Combined offers fetched"));
});

