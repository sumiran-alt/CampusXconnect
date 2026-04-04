const express = require("express");
const {
  createProject,
  getProjects,
  getUserProjects,
  getTrendingProjects,
  getProject,
  updateProject,
  deleteProject,
  toggleProjectLike,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/trending", getTrendingProjects);
router.get("/:projectId", getProject);
router.get("/user/:userId", getUserProjects);

// Protected routes
router.post("/", protect, createProject);
router.put("/:projectId", protect, updateProject);
router.delete("/:projectId", protect, deleteProject);
router.post("/:projectId/like", protect, toggleProjectLike);

module.exports = router;
