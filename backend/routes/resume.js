const express = require("express");
const {
  getOrCreateResume,
  updatePersonalInfo,
  addEducation,
  addExperience,
  addProject,
  addSkills,
  addCertification,
  getAISuggestions,
  exportPDF,
  getPublicResume,
  toggleResumeVisibility,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/public/:userId", getPublicResume);

// Protected routes
router.get("/", protect, getOrCreateResume);
router.put("/personal", protect, updatePersonalInfo);
router.post("/education", protect, addEducation);
router.post("/experience", protect, addExperience);
router.post("/project", protect, addProject);
router.post("/skills", protect, addSkills);
router.post("/certification", protect, addCertification);
router.post("/ai-suggestions", protect, getAISuggestions);
router.post("/export-pdf", protect, exportPDF);
router.put("/visibility", protect, toggleResumeVisibility);

module.exports = router;
