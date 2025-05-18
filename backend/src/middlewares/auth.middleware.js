// 📁 backend/src/middlewares/auth.middleware.js

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // ✅ Named import

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.warn("🚫 No Bearer token found in headers");
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.warn("🚫 Token string missing after Bearer");
    throw new ApiError(401, "Unauthorized: Token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("🔓 Decoded Token:", decoded);

    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if (!user) {
      console.warn("❌ No user found for decoded._id:", decoded._id);
      throw new ApiError(401, "User not found");
    }

    req.user = user; // ✅ Authenticated user injected into req
    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", error?.message);
    throw new ApiError(401, error?.message || "Invalid or expired token");
  }
});
