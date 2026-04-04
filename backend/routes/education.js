const express = require("express");
const {
  addEducation,
  getUserEducation,
  getMyEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, addEducation);
router.get("/my", protect, getMyEducation);
router.get("/user/:userId", getUserEducation);
router.put("/:id", protect, updateEducation);
router.delete("/:id", protect, deleteEducation);

module.exports = router;
