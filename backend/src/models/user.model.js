// // src/models/User.js
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   phone: { type: String, required: true, unique: true },
//   otp: { type: String },
//   otpVerified: { type: Boolean, default: false },
//   name: { type: String },
//   email: { type: String },
// });

// const User = mongoose.model('User', userSchema);
// export default User;

// src/models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'],
    },
    otp: {
      type: String,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true, // ✅ adds createdAt and updatedAt
  }
);

const User = mongoose.model('User', userSchema);
export default User;

