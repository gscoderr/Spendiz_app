import express from "express";
import { triggerSmartBuyScraper } from "../controllers/scraper.controller.js";

const router = express.Router();

router.get("/smartbuy", triggerSmartBuyScraper); // GET /api/v1/scraper/smartbuy

export default router;
