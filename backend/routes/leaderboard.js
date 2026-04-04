const express = require("express");
const {
  getLeaderboard,
  getUserRank,
  getCollegeLeaderboard,
  getLeaderboardStats,
  updateLeaderboardScore,
} = require("../controllers/leaderboardController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getLeaderboard);
router.get("/stats/global", getLeaderboardStats);
router.get("/rank/:userId", getUserRank);
router.get("/college/:collegeName", getCollegeLeaderboard);

// Admin routes
router.post("/update/:userId", protect, adminOnly, updateLeaderboardScore);

module.exports = router;
