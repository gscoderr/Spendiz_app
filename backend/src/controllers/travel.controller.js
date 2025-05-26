import { getFlightOffers } from "../utils/travelpayouts.api.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const fetchTravelDeals = asyncHandler(async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json(new ApiResponse(400, null, "Missing travel params"));
  }

  const deals = await getFlightOffers(from, to, date);
  return res.status(200).json(new ApiResponse(200, deals, "Deals fetched"));
});
