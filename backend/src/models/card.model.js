import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  bank: { type: String, required: true },
  cardName: { type: String, required: true },
  network: { type: String, required: true },
  tier: { type: String, required: true },
  last4Digits: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[0-9]{4}$/.test(v),
      message: "Last 4 digits must be exactly 4 numeric digits"
    }
  },
  cardHolderName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model('Card', cardSchema);
