/** @format */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import the User model
const User = require("../models/User");
const router = express.Router();

// Registration route
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    phone,
    email,
    password,
    userType,
    member,
  } = req.body;

  try {
    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If the user exists, send a 400 response with an error message
      return res.status(400).json({ error: "Choose another email address" });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password and member status
    const newUser = new User({
      firstName,
      lastName,
      address,
      phone,
      email,
      password: hashedPassword, // Store hashed password
      userType,
      member,
    });

    // Save the new user
    await newUser.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering the user:", error);
    res.status(500).send({ error: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the hashed password with the entered password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "secretKey", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
