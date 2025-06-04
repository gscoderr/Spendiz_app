// 📁 routes/dynamic.route.js
import express from "express";
import { importDynamicOffers } from "../controllers/dynamic.controller.js";

const router = express.Router();

// POST /api/dynamic/import
router.post("/import", importDynamicOffers);

export default router;