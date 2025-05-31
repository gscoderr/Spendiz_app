// 📁 routes/offer.route.js
import express from "express";
import { getCombinedOffers } from "../controllers/combined.controller.js";
import { getSmartBuyOffers, getEaseMyTripOffers } from "../controllers/offer.controller.js";
import { getMatchingOffers } from "../controllers/offer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/smartbuy", getSmartBuyOffers);
router.get("/easemytrip", getEaseMyTripOffers);
router.post("/matching", verifyJWT, getMatchingOffers);

// ✅ NEW route to get merged offers
router.post("/combined", verifyJWT, getCombinedOffers);

export default router;
