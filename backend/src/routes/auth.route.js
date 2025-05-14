// routes/auth.routes.js
import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  checkUser,
  registerUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/check-user").post(checkUser);
router.route("/register").post(registerUser);

export default router;
