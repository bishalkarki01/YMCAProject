/**
 * Author : Bishal Karki
 * Discription: Notice model used for for sending and receiving notifcation 
 * Created : 3 November 2024
 * Last Modifies: 3  November 2024
 *
 * 
 */

const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  noticeText: String,
  expirationDate: Date,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Notice", NoticeSchema);
