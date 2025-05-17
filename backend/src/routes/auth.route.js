// routes/auth.routes.js
import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  checkUser,
  registerUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/check-user").post(checkUser);
router.route("/register").post(registerUser);

router.post('/refresh-token', refreshAccessToken);

export default router;
