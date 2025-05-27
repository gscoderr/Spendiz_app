// backend/src/routes/offer.route.js

import express from "express";
import { getMatchingOffers } from "../controllers/offer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/matching", verifyJWT, getMatchingOffers);

export default router;
