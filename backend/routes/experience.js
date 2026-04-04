const express = require("express");
const {
  addExperience,
  getUserExperience,
  getMyExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, addExperience);
router.get("/my", protect, getMyExperience);
router.get("/user/:userId", getUserExperience);
router.put("/:id", protect, updateExperience);
router.delete("/:id", protect, deleteExperience);

module.exports = router;
