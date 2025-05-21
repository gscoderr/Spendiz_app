import express from "express";
import { matchBestCard } from "../controllers/card.controller.js"; // or create new controller file if preferred
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = express.Router();
console.log("🚀 Match route loaded");
// GET /api/v1/match/best-card?category=shopping&subCategory=Online&amount=4000
router.get("/best-card", verifyJWT, matchBestCard);


export default router;
