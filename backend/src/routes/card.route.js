import express from 'express';
import MasterCard from '../models/mastercards.model.js'; // ✅ correct filename and path


const router = express.Router();

// ✅ 1. Get All Banks (Distinct)
router.get('/banks', async (req, res) => {
  try {
    
    const banks = await MasterCard.distinct("bank");
    res.json(banks);
  } catch (err) {
    console.error("❌ Error fetching banks:", err.message);
    res.status(500).json({ message: "Failed to fetch banks" });
  }
});

// ✅ 2. Get Card Names for Selected Bank
router.get('/card-names', async (req, res) => {
  try {
    const { bank } = req.query;
    if (!bank) return res.status(400).json({ message: "Bank is required" });

    const cardNames = await MasterCard.find({ bank }).distinct("cardName");
    res.json(cardNames);
  } catch (err) {
    console.error("❌ Error fetching card names:", err.message);
    res.status(500).json({ message: "Error fetching card names" });
  }
});

// ✅ 3. Get Network & Tier (Auto-fill) for Bank + Card Name
router.get('/card-details', async (req, res) => {
  try {
    const { bank, cardName } = req.query;
    if (!bank || !cardName) {
      return res.status(400).json({ message: "Bank and Card Name are required" });
    }

    const card = await MasterCard.findOne({ bank, cardName }, 'network tier');
    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json({
      network: card.network,
      tier: card.tier,
    });
  } catch (err) {
    console.error("❌ Error fetching card details:", err.message);
    res.status(500).json({ message: "Error fetching card details" });
  }
});

export default router;
