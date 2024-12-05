/**
 * Author : Bishal Karki
 * Discription: Temporary user is used for the verification purpose of the user registration.
 * Created : 1 October 2024
 * Last Modified : 20 Novermber 2024
 *
 * 
 */

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
    isVerified: { type: Boolean, default: true },
    verificationCode: { type: String },
    verificationExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
