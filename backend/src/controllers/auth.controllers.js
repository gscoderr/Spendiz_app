// import { supabase } from '../db/db.js';
// import User from '../models/user.model.js';

// export const verifyOtp = async (req, res) => {
//   const { phone, otp } = req.body;

//   try {
//     const fullPhone = '+91' + phone;

//     // Step 1: Verify OTP with Supabase
//     const { error } = await supabase.auth.verifyOtp({
//       phone: fullPhone,
//       token: otp,
//       type: 'sms',
//     });

//     if (error) {
//       return res.status(400).json({ success: false, message: 'Invalid OTP' });
//     }

//     // Step 2: Check if user exists in DB
//     const existingUser = await User.findOne({ phone });

//     // Step 3: Return response
//     return res.json({
//       success: true,
//       exists: !!existingUser,
//     });

//   } catch (err) {
//     console.error('OTP verify error:', err.message);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };
import { supabase } from '../db/db.js';
import User from '../models/user.model.js';

export const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    const fullPhone = '+91' + phone;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });

    if (error) {
      console.error('Supabase send OTP error:', error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({ success: true, message: 'OTP sent successfully' });

  } catch (err) {
    console.error('Unhandled Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const fullPhone = '+91' + phone;
    const { error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: 'sms',
    });

    if (error) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    const existingUser = await User.findOne({ phone });
    return res.json({ success: true, exists: !!existingUser });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};