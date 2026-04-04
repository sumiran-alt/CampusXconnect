const express = require("express");
const {
  requestVerification,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getVerificationStatus,
  getUserVerificationStatus,
} = require("../controllers/verificationController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// User routes
router.post("/request", protect, requestVerification);
router.get("/status", protect, getVerificationStatus);
router.get("/user/:userId", getUserVerificationStatus);

// Admin routes
router.get("/pending", protect, adminOnly, getPendingVerifications);
router.put("/approve/:verificationId", protect, adminOnly, approveVerification);
router.put("/reject/:verificationId", protect, adminOnly, rejectVerification);

module.exports = router;
