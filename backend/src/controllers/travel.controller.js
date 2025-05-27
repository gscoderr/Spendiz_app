import { getFlightOffers } from "../utils/travelpayouts.api.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const fetchTravelDeals = asyncHandler(async (req, res) => {
  const { from, to, date } = req.query;
  console.log("🟡 Travel query received:", { from, to, date });

  if (!from || !to || !date) {
    return res.status(400).json(new ApiResponse(400, null, "Missing travel params"));
  }

  const apiResponse = await getFlightOffers(from, to, date);
  const deals = apiResponse?.data || [];

  console.log("✅ Fetched deals:", deals.slice(0, 3)); // ✅ Fixed

  return res.status(200).json(new ApiResponse(200, deals, "Deals fetched"));
});
