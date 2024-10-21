/** @format */

const mongoose = require("mongoose");

const RegisteredUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  activeStatus: {
    type: Boolean,
    required: true,
  },
});

const RegisteredUser = mongoose.model("RegisteredUser", RegisteredUserSchema);

module.exports = RegisteredUser;
