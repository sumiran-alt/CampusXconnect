const express = require("express");
const {
  getProfile,
  updateProfile,
  getUserById,
  followUser,
  unfollowUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile/update", authMiddleware, updateProfile);
router.get("/:id", getUserById);
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);

module.exports = router;
