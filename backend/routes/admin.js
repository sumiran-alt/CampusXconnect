const express = require("express");
const adminAuthMiddleware = require("../middleware/adminAuth");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  toggleUserStatus,
  getAllPosts,
  deletePost,
  togglePostFlag,
  getAllProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  getAllSubmissions,
  getStatistics,
  getAllComments,
  deleteComment,
} = require("../controllers/adminController");

const router = express.Router();

// Apply admin auth middleware to all routes
router.use(adminAuthMiddleware);

// ==================== USER MANAGEMENT ====================
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/status", toggleUserStatus);

// ==================== POST MANAGEMENT ====================
router.get("/posts", getAllPosts);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id/flag", togglePostFlag);

// ==================== CODING PROBLEM MANAGEMENT ====================
router.get("/problems", getAllProblems);
router.post("/problems", createProblem);
router.put("/problems/:id", updateProblem);
router.delete("/problems/:id", deleteProblem);

// ==================== SUBMISSION MANAGEMENT ====================
router.get("/submissions", getAllSubmissions);

// ==================== COMMENT MANAGEMENT ====================
router.get("/comments", getAllComments);
router.delete("/comments/:id", deleteComment);

// ==================== STATISTICS ====================
router.get("/stats", getStatistics);

module.exports = router;
