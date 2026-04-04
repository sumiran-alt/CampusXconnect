const express = require("express");
const {
  searchUsers,
  advancedSearch,
  getAllUsers,
} = require("../controllers/searchController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes (no auth required)
// Search users with flexible query
router.get("/search", searchUsers);

// Advanced search with filters
router.get("/advanced", advancedSearch);

// Get all users (paginated)
router.get("/all", getAllUsers);

module.exports = router;
