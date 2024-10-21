/** @format */

const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  memberPrice: {
    type: Number,
    required: true,
  },
  nonMemberPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  participants: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Program", ProgramSchema);
