// 📁 controllers/dynamic.controller.js
import Dynamic from "../models/dynamic.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// POST /api/dynamic/import
export const importDynamicOffers = asyncHandler(async (req, res) => {
  const { offers } = req.body;

  if (!Array.isArray(offers) || offers.length === 0) {
    throw new ApiError(400, "Offers array is required and cannot be empty.");
  }

  const inserted = await Dynamic.insertMany(offers);
  res.status(201).json(new ApiResponse(201, inserted, "Dynamic offers imported successfully"));
});