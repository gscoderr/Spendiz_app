// src/routes/auth.route.js
import express from 'express';
import User from '../models/user.model.js';
import otpGenerator from 'otp-generator';

const router = express.Router();

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.json({ success: false, message: 'Phone is required' });

  const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });

  try {
    let user = await User.findOne({ phone });
    if (!user) user = new User({ phone });

    user.otp = otp;
    user.otpVerified = false;
    await user.save();

    console.log(`🔐 OTP for ${phone}: ${otp}`); // Replace with real SMS sending
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: 'Error sending OTP' });
  }
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user || user.otp !== otp) {
      return res.json({ verified: false, message: 'Incorrect OTP' });
    }

    user.otpVerified = true;
    await user.save();

    return res.json({ verified: true });
  } catch (err) {
    return res.json({ verified: false, message: 'Verification failed' });
  }
});

// POST /auth/register
router.post('/register', async (req, res) => {
  const { phone, name, email } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user || !user.otpVerified) {
      return res.json({ success: false, message: 'OTP not verified' });
    }

    user.name = name;
    user.email = email;
    await user.save();

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: 'Registration failed' });
  }
});

export default router;


















// import express from 'express';
// import User from '../models/user.model.js';

// const router = express.Router();

// const generateAuthToken = (userId) => {
//   // Placeholder for token generation logic
//  return jwt.sign({userId }, process.env.JWT_SECRET, { expiresIn: '10h' });

// };

// router.post('/register', async (req, res) => {
//   // Handle register logic here
//  8
//   try {
//     const { userName,email, password } = req.body

//     // Validate user credentials (this is just a placeholder)
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }
//     if (password.length < 6) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      
//     }
//     if(userName.length < 3) {
//       return res.status(400).json({ message: 'Username must be at least 3 characters long' });
//     }

//     // Check if user exists in the database
//     const existingUser= await User.findOne({ $or: [{ email }, { phone }] });
//     if(existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     // Create a new user
//     const user = new User({
//         userName,
//        email, 
//        password });
//     await user.save();

//     const token = user.generateAuthToken(user._id);
//     res.status(201).json({ 
//       token,
//       user: {
//          _id: user._id,
//           email: user.email
//          } 
//         });

//   } catch (error) {
//   console.error('Login error:', error);
//   res.status(500).send('Internal Server Error');

// }

// });

// router.get('/login', async (req, res) => {
//   // Handle registration logic here
//   res.send('login route');
// });

// export default router;
