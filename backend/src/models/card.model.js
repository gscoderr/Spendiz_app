import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({

    bank: { 
        type: String,
         required: true 
        },
    cardName: { type: String, required: true },
    network: { type: String, required: true },
    tier: { type: String, required: true },
    last4Digits: { type: String, required: true, maxlength: 4 },
    cardHolderName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Card = mongoose.model('Card', cardSchema);

export default Card;
