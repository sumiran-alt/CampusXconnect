const express = require("express");
const {
  getProblems,
  getProblemById,
  submitSolution,
  getUserSubmissions,
  getLeaderboard,
} = require("../controllers/codingController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/problems", getProblems);
router.get("/problems/:id", getProblemById);
router.post("/submit", authMiddleware, submitSolution);
router.get("/submissions/:userId", getUserSubmissions);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
