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
} = require("../controllers/postController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/createPost", authMiddleware, createPost);
router.get("/feed", getFeed);
router.get("/:id", getPostById);
router.post("/like/:id", authMiddleware, likePost);
router.post("/unlike/:id", authMiddleware, unlikePost);
router.post("/comment/:id", authMiddleware, commentOnPost);
router.get("/comments/:id", getComments);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);

module.exports = router;
