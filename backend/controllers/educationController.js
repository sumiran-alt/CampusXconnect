const Education = require("../models/Education");

// @desc    Add education
// @route   POST /api/education
// @access  Private
exports.addEducation = async (req, res) => {
  try {
    const { school, degree, fieldOfStudy, startDate, endDate, currentlyStudying, grade, activities, description } = req.body;

    if (!school || !degree || !fieldOfStudy || !startDate) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const education = await Education.create({
      userId: req.user.id,
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate: currentlyStudying ? null : endDate,
      currentlyStudying,
      grade,
      activities,
      description,
    });

    res.status(201).json({
      success: true,
      education,
      message: "Education added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to add education",
    });
  }
};

// @desc    Get user education
// @route   GET /api/education/user/:userId
// @access  Public
exports.getUserEducation = async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = require("mongoose");
    
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Convert to ObjectId for consistent querying
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const education = await Education.find({ userId: userObjectId }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      education,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get my education
// @route   GET /api/education/my
// @access  Private
exports.getMyEducation = async (req, res) => {
  try {
    const education = await Education.find({ userId: req.user.id }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      education,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update education
// @route   PUT /api/education/:id
// @access  Private
exports.updateEducation = async (req, res) => {
  try {
    let education = await Education.findById(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    if (education.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this education" });
    }

    education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      education,
      message: "Education updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Delete education
// @route   DELETE /api/education/:id
// @access  Private
exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    if (education.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this education" });
    }

    await Education.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
