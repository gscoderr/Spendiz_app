
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,

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
  required: [true, "Email is required"],  // ✅ required
  unique: true,                           
  trim: true,
  lowercase: true,
  match: [
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    "Please enter a valid email address"
  ],                                     
},


  },
  {
    timestamps: true, // ✅ adds createdAt and updatedAt
  }
);

const User = mongoose.model('User', userSchema);
export default User;

