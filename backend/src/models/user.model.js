// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  otp: { type: String },
  otpVerified: { type: Boolean, default: false },
  name: { type: String },
  email: { type: String },
});

const User = mongoose.model('User', userSchema);
export default User;


















// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//     userName: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim: true,
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6,

//     },

    
//     // phone: {
//     //     type: Number,
//     //     required: true,
//     //     unique: true,
//     // },
// }, {
//     timestamps: true,
// });

// // Hash password before saving to the database
// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) return next();
//     {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
        
//     }
//     next();
// });

// const User = mongoose.model("User", userSchema);


// export default User;