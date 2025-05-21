import express from "express";
import { matchBestCard } from "../controllers/match.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
console.log("🚀 Match routes loaded");

router.get("/best-card", verifyJWT, matchBestCard);

export default router;
