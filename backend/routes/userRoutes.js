/** @format */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");

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
    // Find user by email
    const user = await User.findOne({ email });

    // If the user is not found
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // If the password is correct, generate a token (assuming JWT)
    const token = generateAuthToken(user);

    // Return token and role in the response
    res.json({
      token,
      role: user.userType,
      userId: user._id,
      firstName: user.firstName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

function generateAuthToken(user) {
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.userType,
      isMember: user.member,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
}

router.get("/user/member-status", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ isMember: user.member });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
