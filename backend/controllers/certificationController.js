const Certification = require("../models/Certification");

// @desc    Add certification
// @route   POST /api/certification
// @access  Private
exports.addCertification = async (req, res) => {
  try {
    const { name, issuer, issueDate, expiryDate, doesNotExpire, credentialId, credentialUrl, description } = req.body;

    if (!name || !issuer || !issueDate) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const certification = await Certification.create({
      userId: req.user.id,
      name,
      issuer,
      issueDate,
      expiryDate: doesNotExpire ? null : expiryDate,
      doesNotExpire,
      credentialId,
      credentialUrl,
      description,
    });

    res.status(201).json({
      success: true,
      certification,
      message: "Certification added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to add certification",
    });
  }
};

// @desc    Get user certifications
// @route   GET /api/certification/user/:userId
// @access  Public
exports.getUserCertifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = require("mongoose");
    
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Convert to ObjectId for consistent querying
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const certifications = await Certification.find({ userId: userObjectId }).sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      certifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get my certifications
// @route   GET /api/certification/my
// @access  Private
exports.getMyCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find({ userId: req.user.id }).sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      certifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update certification
// @route   PUT /api/certification/:id
// @access  Private
exports.updateCertification = async (req, res) => {
  try {
    let certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    if (certification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this certification" });
    }

    certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      certification,
      message: "Certification updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Delete certification
// @route   DELETE /api/certification/:id
// @access  Private
exports.deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    if (certification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this certification" });
    }

    await Certification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
