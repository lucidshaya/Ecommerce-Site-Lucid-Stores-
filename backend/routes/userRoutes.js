const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Helper function for error responses
const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message });
};

//@route POST /api/users/register
//@desc Register a new user
//@access Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return sendErrorResponse(res, 400, "Please provide all required fields");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendErrorResponse(res, 400, "Please provide a valid email address");
    }

    let user = await User.findOne({ email });
    if (user) {
      return sendErrorResponse(res, 400, "User already exists");
    }

    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    sendErrorResponse(res, 500, "Server error during registration");
  }
});

//@route POST /api/users/login
//@desc Authenticate a user
//@access Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendErrorResponse(res, 400, "Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 400, "Invalid credentials");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendErrorResponse(res, 400, "Invalid credentials");
    }

    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) {
          console.error("JWT Sign error:", err);
          return sendErrorResponse(res, 500, "Error generating token");
        }

        console.log('Generated token:', token);
        res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    sendErrorResponse(res, 500, "Server error during login");
  }
});

//@route GET /api/users/profile
//@desc Get logged in user's profile (Protected route)
//@access Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    sendErrorResponse(res, 500, "Server error while fetching profile");
  }
});

module.exports = router;
