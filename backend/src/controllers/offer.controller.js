// backend/src/controllers/offer.controller.js

import Offer from "../models/offer.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getMatchingOffers = asyncHandler(async (req, res) => {
    const { cards = [], category, subCategory } = req.body;

    console.log("🔍 Request received with cards:", cards);
    console.log("🔍 Category:", category, "SubCategory:", subCategory);


    const today = new Date();

    const conditions = cards.map((card) => ({
        bank: { $regex: new RegExp(`^${card.bank}$`, "i") },
        $or: [
            { cardNames: { $size: 0 } },
            { cardNames: { $elemMatch: { $regex: new RegExp(`^${card.cardName}$`, "i") } } },
            { cardNames: { $exists: false } },
        ],
        ...(category && { category }),
        ...(subCategory && { subCategory }),
        validTill: { $gte: today },
    }));

    console.log("🧠 Mongo Conditions:", conditions);

    // ✅ First: log all offers in DB
    console.log("📦 ALL OFFERS in DB:", await Offer.find({}));

    // ✅ Now fetch matching offers
    const offers = await Offer.find({ $or: conditions });
    console.log("🎯 Offers matched:", offers);


    res.status(200).json(new ApiResponse(200, offers, "Offers fetched successfully"));
});

