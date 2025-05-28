import scrapeSmartBuyOffers from "../scraper/hdfcSmartBuy.scraper.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const triggerSmartBuyScraper = asyncHandler(async (req, res) => {
  await scrapeSmartBuyOffers();
  return res.status(200).json(new ApiResponse(200, null, "SmartBuy scraper executed"));
});
