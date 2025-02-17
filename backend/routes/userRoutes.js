/**
 * Author : Bishal Karki
 * Discription: Routes for user related task 
 * Created : 13 October 2024
 * Last Modified : 20 Novermber 2024
 *
 * 
 */


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const authenticateToken = require("../middleware/authMiddleware");

// Import the User model
const User = require("../models/User");
const TemporaryUser = require("../models/TemporaryUser");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Registration endpoint to save to TemporaryUser and send code
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
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    // Check if email already exists in User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Please choose another email address.",
      });
    }
    // Save data to TemporaryUser collection
    const tempUser = new TemporaryUser({
      firstName,
      lastName,
      address,
      phone,
      email,
      password,
      userType,
      member,
      verificationCode,
    });
    await tempUser.save();

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      to: email,
      subject: "Complete Your Registration - Verify Your Email",
      text: `Hi ${tempUser.firstName},\n\nThank you for registering! Your verification code is ${verificationCode}.\n\nPlease enter this code in the app to verify your account and complete your registration.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification code sent to email." });
  } catch (error) {
    console.error("Error in registration:", error); // Log detailed error
    res.status(500).json({ success: false, message: "Registration failed." });
  }
});

//Verify endpoint to verify the user's email
router.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  try {
    // Find the temporary user by email and code
    const tempUser = await TemporaryUser.findOne({
      email,
      verificationCode: code,
    });

    if (!tempUser) {
      return res.status(400).json({ success: false, message: "Invalid code." });
    }

    // Hash the password before moving to the User collection
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);

    // Move data to the User collection with the hashed password
    const newUser = new User({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      address: tempUser.address,
      phone: tempUser.phone,
      email: tempUser.email,
      password: hashedPassword,
      userType: tempUser.userType,
      member: tempUser.member,
    });
    await newUser.save();

    // Delete temporary user after successful registration
    await TemporaryUser.deleteOne({ _id: tempUser._id });
    res.json({
      success: true,
      message: "Email verified and registration complete.",
    });
  } catch (error) {
    console.error("Error in verification:", error);
    res.status(500).json({ success: false, message: "Verification failed." });
  }
});

// Login endpoint for login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
  //Check if the email is in TemporaryUser collection (pending verification)
    const tempUser = await TemporaryUser.findOne({ email });
    if (tempUser) {
      // Generate a new verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      tempUser.verificationCode = verificationCode;
      await tempUser.save();

      // Send verification code email
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Complete Your Registration - Verify Your Email",
        text: `Hi ${tempUser.firstName},\n\nThank you for registering! Your verification code is ${verificationCode}.\n\nPlease enter this code in the app to verify your account and complete your registration.`,
      };
      await transporter.sendMail(mailOptions);

      return res.status(403).json({
        message:
          "Email not verified. A new verification code has been sent to your email.",
      });
    }

    //If not in TemporaryUser, check the User collection for login
    const user = await User.findOne({ email });

    // If the user is not found in User collection
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Your account is not verified. Please verify your email.",
      });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the password is correct, generate a token
    const token = generateAuthToken(user);

    // Return token and user details in the response
    res.json({
      token,
      role: user.userType,
      userId: user._id,
      firstName: user.firstName,
    });
  } catch (error) {
    console.error("Error in login:", error);
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

router.get("/protected-route", authenticateToken, (req, res) => {
  res.json({
    message: "This is a protected route accessible only with a valid token!",
  });
});


//Logout endpoint to logout
router.post("/logout", (req, res) => {
  // Check if session exists
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ msg: "Failed to log out" });
      } else {
        // Clear the session cookie
        res.clearCookie("connect.sid"); 
        res.json({ msg: "ok" });
      }
    });
  } else {
    res.json({ msg: "No active session" });
  }
});

//End points to find the member-status where they are active or not
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


// Route to get all users except the logged-in user
router.get("/getUsers", authenticateToken, async (req, res) => {
  try {
    const loggedInUserId = req.user._id; 
    const users = await User.find({ _id: { $ne: loggedInUserId } });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to retrieve users." });
  }
});


//Disable enable user login from the admin
router.patch("/updateUser/:userId", async (req, res) => {
  const { userId } = req.params;
  const { isVerified } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { isVerified }, { new: true });
    res
      .status(200)
      .json({ success: true, message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user." });
  }
});

module.exports = router;
