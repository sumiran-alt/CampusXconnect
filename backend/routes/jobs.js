const express = require("express");
const {
  postJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/jobController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:jobId", getJob);

// Protected routes
router.post("/", protect, postJob);
router.put("/:jobId", protect, updateJob);
router.delete("/:jobId", protect, deleteJob);

// Application routes
router.post("/:jobId/apply", protect, applyJob);
router.get("/applications/my", protect, getMyApplications);
router.get("/:jobId/applications", protect, getJobApplications);
router.put("/applications/:applicationId", protect, updateApplicationStatus);

module.exports = router;
