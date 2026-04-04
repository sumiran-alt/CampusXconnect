const express = require("express");
const {
  createPost,
  getFeed,
  getPostById,
  likePost,
  unlikePost,
  commentOnPost,
  getComments,
  deletePost,
  updatePost,
  getUserPosts,
  getUserPostsById,
} = require("../controllers/postController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/createPost", protect, createPost);
router.get("/my-posts", protect, getUserPosts);
router.get("/user/:userId", getUserPostsById);
router.get("/feed", getFeed);
router.post("/like/:id", protect, likePost);
router.post("/unlike/:id", protect, unlikePost);
router.post("/comment/:id", protect, commentOnPost);
router.get("/comments/:id", protect, getComments);
router.delete("/:id", protect, deletePost);
router.put("/:id", protect, updatePost);
router.get("/:id", getPostById);

module.exports = router;
