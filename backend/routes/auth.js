const express = require("express");
const {
  signup,
  login,
  adminSignup,
  adminLogin,
  sendOTP,
  verifyOTPAndLogin,
} = require("../controllers/authController");

const router = express.Router();

// User routes
router.post("/signup", signup);
router.post("/login", login);

// OTP routes (for forgot password)
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPAndLogin);

// Admin routes
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);

module.exports = router;
