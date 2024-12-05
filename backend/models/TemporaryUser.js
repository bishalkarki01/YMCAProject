/**
 * Author : Bishal Karki
 * Discription: Temporary user is used for the verification purpose of the user registration.
 * Created : 3 October 2024
 *
 * 
 */

const mongoose = require("mongoose");

const TemporaryUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  member: { type: Boolean, default: false },
  verificationCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "15m" },
});

module.exports = mongoose.model("TemporaryUser", TemporaryUserSchema);
