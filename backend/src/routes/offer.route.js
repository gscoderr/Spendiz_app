import express from "express";
import { getMatchingOffers } from "../controllers/offer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔐 Protect this route
router.post("/matching", verifyJWT, getMatchingOffers);

export default router;
