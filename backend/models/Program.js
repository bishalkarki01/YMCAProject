/**
 * Author : Bishal Karki
 * Discription: Program model used for program related task 
 * Created : 2 October 2024
 * Last Modifies: 20  November 2024
 *
 * 
 */

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
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  days: {
    type: [String],
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
  question: {
    type: String,
    required: false,
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
