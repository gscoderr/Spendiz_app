
import express from 'express';
import { sendOtp, verifyOtp,checkUser } from '../controllers/auth.controllers.js';


const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/check-user',checkUser);

export default router;