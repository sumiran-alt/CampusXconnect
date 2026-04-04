const express = require("express");
const {
  createHackathon,
  getHackathons,
  getHackathon,
  registerTeam,
  joinTeam,
  submitProject,
  getHackathonLeaderboard,
  scoreSubmission,
} = require("../controllers/hackathonController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getHackathons);
router.get("/:hackathonId", getHackathon);
router.get("/:hackathonId/leaderboard", getHackathonLeaderboard);

// Protected routes
router.post("/", protect, adminOnly, createHackathon);
router.post("/:hackathonId/register-team", protect, registerTeam);
router.post("/teams/:teamId/join", protect, joinTeam);
router.post("/:hackathonId/submit", protect, submitProject);
router.put("/submissions/:submissionId/score", protect, scoreSubmission);

module.exports = router;
