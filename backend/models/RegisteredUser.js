/**
 * Author : Bishal Karki
 * Discription: RegisterUser model used for specific user whihc are registered for the program 
 * Created : 2 October 2024
 * Last Modifies:  5 November 2024
 *
 * 
 */

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
  parentEmail: {
    type: String,
  },
  activeStatus: {
    type: Boolean,
    required: true,
  },
});

const RegisteredUser = mongoose.model("RegisteredUser", RegisteredUserSchema);

module.exports = RegisteredUser;
