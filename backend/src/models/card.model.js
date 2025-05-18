// 📍 backend/src/models/card.model.js
import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    bank: { type: String, required: true },
    cardName: { type: String, required: true },
    network: { type: String, required: true },
    tier: { type: String, required: true },
    last4Digits: { type: String, required: true },
    cardHolderName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
  },
  { timestamps: true }
);

export default mongoose.model('Card', cardSchema);
