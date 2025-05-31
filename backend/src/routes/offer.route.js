import express from "express";
import { getSmartBuyOffers, getMatchingOffers } from "../controllers/offer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/smartbuy", getSmartBuyOffers);            // ✅ frontend public use
router.post("/matching", verifyJWT, getMatchingOffers); // ✅ backend protected logic

export default router;


// import express from "express";
// import {
//   getSmartBuyOffers,
//   getMatchingOffers,
//   getSmartBuyMatchingOffers, // ✅ NEW: SmartBuy + Card match
// } from "../controllers/offer.controller.js";

// import { verifyJWT } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // ✅ Public route to show all SmartBuy offers (fallback)
// router.get("/smartbuy", getSmartBuyOffers);

// // ✅ Protected: match by user's cards + category/subCategory
// router.post("/matching", verifyJWT, getMatchingOffers);

// // ✅ Protected: SmartBuy-specific matching logic
// router.post("/smartbuy/matching", verifyJWT, getSmartBuyMatchingOffers); // 🆕 ADD THIS

// export default router;
