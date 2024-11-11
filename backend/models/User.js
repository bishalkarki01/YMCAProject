/** @format */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    member: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }, // New field to mark email verification status
    verificationCode: { type: String }, // Optional, for storing verification code (if needed in the User model)
    verificationExpires: { type: Date }, // Optional, for expiry date of verification code
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
