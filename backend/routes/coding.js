const express = require("express");
const {
  getProblems,
  getProblemBySlug,
  getProblemById,
  runCode,
  submitSolution,
  getUserSubmissions,
  getUserProgress,
  getLeaderboard,
  getProblemSubmissions,
} = require("../controllers/codingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Problem routes
router.get("/problems", getProblems);
router.get("/problems/slug/:slug", getProblemBySlug);
router.get("/problems/id/:id", getProblemById);

// Code execution routes
router.post("/run", protect, runCode);
router.post("/submit", protect, submitSolution);

// User routes
router.get("/submissions", protect, getUserSubmissions);
router.get(
  "/submissions/problem/:problemId",
  protect,
  getProblemSubmissions,
);
router.get("/progress", protect, getUserProgress);

// Leaderboard
router.get("/leaderboard", getLeaderboard);

module.exports = router;
