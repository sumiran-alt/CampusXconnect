const express = require("express");
const {
  addCertification,
  getUserCertifications,
  getMyCertifications,
  updateCertification,
  deleteCertification,
} = require("../controllers/certificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, addCertification);
router.get("/my", protect, getMyCertifications);
router.get("/user/:userId", getUserCertifications);
router.put("/:id", protect, updateCertification);
router.delete("/:id", protect, deleteCertification);

module.exports = router;
