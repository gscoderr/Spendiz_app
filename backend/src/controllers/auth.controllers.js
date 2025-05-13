// controllers/auth.controller.js

import { supabase } from '../db/db.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/AsyncHandler.js';
import { isValidPhoneNumber } from 'libphonenumber-js';

// ✅ Send OTP
export const sendOtp = asyncHandler(async(req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  const fullPhone = '+91' + phone;
  const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });

  if (error) {
    throw new ApiError(400, `Supabase Error: ${error.message}`);
  }

  return res.status(200).json(
    new ApiResponse(200, null, "OTP sent successfully")
  );
});

// ✅ Verify OTP
export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    throw new ApiError(400, "Phone and OTP are required");
  }

  const fullPhone = '+91' + phone;
  const { error } = await supabase.auth.verifyOtp({
    phone: fullPhone,
    token: otp,
    type: 'sms',
  });

  if (error) {
    throw new ApiError(400, "Invalid OTP");
  }

  const existingUser = await User.findOne({ phone });
  return res.status(200).json(
    new ApiResponse(200, { exists: !!existingUser }, "OTP verified successfully")
  );
});

// ✅ Check if user exists (optional endpoint)
export const checkUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  const user = await User.findOne({ phone: '+91' + phone });
  const exists = !!user;

  return res.status(200).json(
    new ApiResponse(200, { exists }, exists ? "User exists" : "User not found")
  );
});

// Register User after OTP
export const registerUser = asyncHandler(async (req, res) => {
  const { phone, name, email } = req.body;
console.log("PHONE RECEIVED FROM FRONTEND:", req.body.phone);

  if (!phone || !name) {
    throw new ApiError(400, "Phone and name are required");
  }

   if (!isValidPhoneNumber(phone)) {
    throw new ApiError(400, "Phone number is not valid");
  }


  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    phone: '+91' + phone,
    name,
    email,
    otpVerified: true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});


