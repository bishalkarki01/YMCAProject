/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");

const userRoutes = require("../backend/routes/userRoutes");
const programRoutes = require("./routes/programRoutes");

connectDB();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Use the user routes
app.use("/", userRoutes);
app.use("/program", programRoutes);

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
