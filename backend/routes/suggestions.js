const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  sendSuggestion,
  getUserSuggestions,
  markAsRead,
  deleteSuggestion,
  getSuggestions,
  getSuggestionsForUser,
  getTrendingSuggestions,
} = require("../controllers/suggestionController");

// All routes require authentication
router.use(protect);

// ========== SEND SUGGESTIONS ==========
// Send a suggestion to another user
router.post("/send", sendSuggestion);

// ========== VERY SPECIFIC GET ROUTES FIRST ==========
// These must come before the general GET / route

// Get all suggestions for a specific user (by userId param)
router.get("/received/:userId", getUserSuggestions);

// Get trending suggestions in current user's branch
router.get("/trending", getTrendingSuggestions);

// Get suggestions based on a specific user profile
router.get("/user/:profileUserId", getSuggestionsForUser);

// ========== MANAGE SUGGESTIONS ==========
// Mark suggestion as read
router.put("/:suggestionId/read", markAsRead);

// Delete a suggestion
router.delete("/:suggestionId", deleteSuggestion);

// ========== GENERAL GET ROUTE LAST ==========
// Get suggestions for current user (based on mutual connections)
// This is the most general route and must come last
router.get("/", getSuggestions);

module.exports = router;
