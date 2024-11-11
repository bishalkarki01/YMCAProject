/** @format */

const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  noticeText: String,
  expirationDate: Date,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Notice", NoticeSchema);
