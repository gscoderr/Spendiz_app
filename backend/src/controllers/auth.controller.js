// controllers/auth.controller.js

import { supabase } from "../db/db.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { isValidPhoneNumber } from "libphonenumber-js";
import jwt from "jsonwebtoken";

// ==========================================================
// ✅ Helper: Generate Access + Refresh Token for a user
// ==========================================================
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};


// ==========================================================
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(403, "Invalid or expired refresh token");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
      new ApiResponse(200, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user,
      }, "Token refreshed")
    );
  } catch (err) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }
});




// ==============================================================================
// @desc    Send OTP to user's phone number
// @route   POST /api/v1/auth/send-otp
// ==============================================================================
export const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  const fullPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

  // ✅ Step 1: Validate phone number format
  if (!isValidPhoneNumber(fullPhone)) {
    throw new ApiError(400, `${fullPhone} is not a valid phone number`);
  }

  
  // ✅ Step 2: DEV MODE (skip actual OTP sending)
  if (process.env.NODE_ENV === "development") {
    console.log("⚠️ Dev Mode: OTP sending skipped for", fullPhone);
    return res.status(200).json(
      new ApiResponse(200, null, "OTP skipped in development mode")
    );
  }

  const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
  console.log("PHONE RECEIVED FROM FRONTEND:", fullPhone);
  if (error) {
    throw new ApiError(400, `Supabase Error: ${error.message}`);
  }

  return res.status(200).json(
    new ApiResponse(200, null, "OTP sent successfully")
  );
});

// ==============================================================================
// @desc    Verify OTP (real or mock in dev), issue JWTs
// @route   POST /api/v1/auth/verify-otp
// ==============================================================================
export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    throw new ApiError(400, "Phone and OTP are required");
  }
  const fullPhone = phone?.startsWith('+91') ? phone : `+91${phone}`;

  if (!isValidPhoneNumber(fullPhone)) {
    throw new ApiError(400, `${fullPhone} is not a valid phone number`);
  }


  if (process.env.NODE_ENV === "development") {
    // if (true) {
    console.log("✅ Dev mode: Bypassing OTP verification");

    const user = await User.findOne({ phone: fullPhone });



    if (!user) {

      return res.status(200).json(
        new ApiResponse(200, { exists: false }, "Dev OTP verified — user not registered")
      );
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const options = { httpOnly: true, secure: false }; // Set secure: true in production

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, {
          user,
          accessToken,
          refreshToken,
          // redirectTo: "/dashboard"
        }, "Dev login success (OTP bypassed)")
      );
  }

  // ✅ REAL OTP Verification using Supabase (prod or staging)
  const { error } = await supabase.auth.verifyOtp({
    phone: fullPhone,
    token: otp,
    type: "sms",
  });

  if (error) {
    throw new ApiError(400, "Invalid OTP");
  }

  const user = await User.findOne({ phone: fullPhone });

  if (!user) {
    return res.status(200).json(
      new ApiResponse(200, { exists: false }, "OTP verified — user not registered")
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user,
        accessToken,
        refreshToken,
        // redirectTo: "/dashboard"
      }, "OTP verified & user logged in")
    );
}
);


// ==============================================================================
// @desc    Check if user exists by phone number
// @route   POST /api/v1/auth/check-user
// ==============================================================================
export const checkUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  const user = await User.findOne({ phone: "+91" + phone });
  const exists = !!user;

  return res.status(200).json(
    new ApiResponse(200, { exists }, exists ? "User exists" : "User not found")
  );
});

// ==============================================================================
// @desc    Register user after OTP verification
// @route   POST /api/v1/auth/register
// ==============================================================================
export const registerUser = asyncHandler(async (req, res) => {
  const { phone, name, email } = req.body;
  console.log("PHONE RECEIVED FROM FRONTEND:", phone);

  if (!phone || !name) {
    throw new ApiError(400, "Phone and name are required");
  }

  if (!isValidPhoneNumber(phone)) {
    throw new ApiError(400, "Phone number is not valid");
  }

  const fullPhone = phone?.startsWith('+91') ? phone : `+91${phone}`;

  const existingUser = await User.findOne({ phone: fullPhone });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  try {
    const user = await User.create({
      phone: fullPhone,
      name,
      email,
      otpVerified: true,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);



    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res.status(201).json(
      new ApiResponse(201, {
        user,
        accessToken,
        refreshToken,
      }, "User registered successfully")
    );
  } catch (err) {
    console.error("❌ Register error:", err);

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      throw new ApiError(400, messages.join(', '));
    }

    throw new ApiError(500, "Something went wrong during registration");
  }
});


//===========================================================
// @desc    Verify OTP
// @route   POST /api/v1/auth/verify-otp
// ==============================================================
