// 📁 routes/offer.route.js
import express from "express";
import {
  getSmartBuyOffers,
  getEaseMyTripOffers,
  getMatchingOffers,
  getAllOffers,
  getOfferById
} from "../controllers/offer.controller.js";

import { getCombinedOffers } from "../controllers/combined.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔓 Public routes
router.get("/smartbuy", getSmartBuyOffers);
router.get("/easemytrip", getEaseMyTripOffers);
router.get("/all", getAllOffers);
router.get("/:id", getOfferById); // ✅ New: View single offer details (with domTree etc.)

// 🔐 Protected routes (require JWT)
router.post("/matching", verifyJWT, getMatchingOffers);
router.post("/combined", verifyJWT, getCombinedOffers);

export default router;
