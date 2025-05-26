import express from "express";
import { fetchTravelDeals } from "../controllers/travel.controller.js";

const router = express.Router();

router.get("/flights", fetchTravelDeals); // /api/travel/flights?from=DEL&to=BOM&date=2025-06-10

export default router;
