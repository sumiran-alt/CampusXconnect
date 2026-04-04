const express = require("express");
const {
  createCommunity,
  getCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
  createCommunityPost,
  getCommunityPosts,
  likeCommunityPost,
  addComment,
  getPostComments,
} = require("../controllers/communityController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getCommunities);
router.get("/:slug", getCommunity);
router.get("/:communityId/posts", getCommunityPosts);
router.get("/posts/:postId/comments", getPostComments);

// Protected routes
router.post("/", protect, createCommunity);
router.post("/:communityId/join", protect, joinCommunity);
router.post("/:communityId/leave", protect, leaveCommunity);
router.post("/:communityId/posts", protect, createCommunityPost);
router.post("/posts/:postId/like", protect, likeCommunityPost);
router.post("/posts/:postId/comments", protect, addComment);

module.exports = router;
