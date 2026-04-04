const express = require("express");
const {
  createIdea,
  getIdeas,
  getIdea,
  expressInterest,
  acceptInterestedUser,
  updateIdea,
  deleteIdea,
} = require("../controllers/startupController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getIdeas);
router.get("/:ideaId", getIdea);

// Protected routes
router.post("/", protect, createIdea);
router.put("/:ideaId", protect, updateIdea);
router.delete("/:ideaId", protect, deleteIdea);
router.post("/:ideaId/interested", protect, expressInterest);
router.put("/:ideaId/accept/:userId", protect, acceptInterestedUser);

module.exports = router;
