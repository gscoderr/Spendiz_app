import express from "express";
import { getSmartBuyOffers, getMatchingOffers } from "../controllers/offer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/smartbuy", getSmartBuyOffers);            // ✅ frontend public use
router.post("/matching", verifyJWT, getMatchingOffers); // ✅ backend protected logic

export default router;
