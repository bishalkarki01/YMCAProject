/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

const userRoutes = require("../backend/routes/userRoutes");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/YMCA-Project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Use the user routes
app.use("/", userRoutes);

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
