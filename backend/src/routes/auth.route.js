// import express from 'express';
// import User from '../models/user.model.js';
// import otpGenerator from 'otp-generator';
// import axios from 'axios';

// const router = express.Router();

// // POST /auth/send-otp
// router.post('/send-otp', async (req, res) => {
//   res.setHeader('Content-Type', 'application/json'); // ✅ Ensure the response is always JSON

//   const { phone } = req.body;
//   if (!phone) {
//     // ✅ Added proper 400 status code for bad input
//     return res.status(400).json({ success: false, message: 'Phone is required' });
//   }

//   const otp = otpGenerator.generate(6, {
//     digits: true,
//     upperCase: false,
//     specialChars: false,
//   });

//   try {
//     let user = await User.findOne({ phone });
//     if (!user) user = new User({ phone });

//     user.otp = otp;
//     user.otpVerified = false;
//     await user.save();

//     try {
//       // ✅ Fast2SMS call now wrapped in try-catch to avoid breaking if API fails
//       const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
//         params: {
//           authorization: process.env.FAST2SMS_API_KEY,
//           variables_values: otp,
//           route: 'otp',
//           numbers: phone,
//         },
//       });
//       console.log('SMS URL:', response.config.url);


//       if (response.data.return === true) {
//         // ✅ Respond with 200 if OTP was successfully sent
//         return res.status(200).json({ success: true, message: 'OTP sent successfully' });
//       } else {
//         return res.status(500).json({ success: false, message: 'OTP sending failed' });
//       }
//     } catch (smsErr) {
//       // ✅ Catch SMS sending error separately
//       console.error('SMS error:', smsErr.message);
//       return res.status(500).json({ success: false, message: 'SMS sending failed' });
//     }
//   } catch (err) {
//     console.error('OTP error:', err);
//     return res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // POST /auth/verify-otp
// router.post('/verify-otp', async (req, res) => {
//   res.setHeader('Content-Type', 'application/json'); // ✅ Ensures consistent JSON response
//   const { phone, otp } = req.body;

//   try {
//     const user = await User.findOne({ phone });
//     if (!user || user.otp !== otp) {
//       // ✅ Use 400 for incorrect OTP to indicate client error
//       return res.status(400).json({ verified: false, message: 'Incorrect OTP' });
//     }

//     user.otpVerified = true;
//     await user.save();

//     return res.status(200).json({ verified: true });
//   } catch (err) {
//     console.error('Verify error:', err);
//     return res.status(500).json({ verified: false, message: 'Verification failed' });
//   }
// });

// // POST /auth/register
// router.post('/register', async (req, res) => {
//   res.setHeader('Content-Type', 'application/json'); // ✅ Ensures consistent JSON response
//   const { phone, name, email } = req.body;

//   try {
//     const user = await User.findOne({ phone });
//     if (!user || !user.otpVerified) {
//       return res.status(400).json({ success: false, message: 'OTP not verified' });
//     }

//     user.name = name;
//     user.email = email;
//     await user.save();

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     console.error('Register error:', err);
//     return res.status(500).json({ success: false, message: 'Registration failed' });
//   }
// });

// export default router;


import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;