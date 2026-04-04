const express = require("express");
const {
  getProfile,
  updateProfile,
  getUserById,
  followUser,
  unfollowUser,
  completeProfileSetup,
  setUserType,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/user-type", protect, setUserType);
router.put("/profile/complete", protect, completeProfileSetup);
router.put("/profile/update", protect, updateProfile);
router.get("/:id", getUserById);
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);

module.exports = router;
