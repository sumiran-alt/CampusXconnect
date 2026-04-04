const Experience = require("../models/Experience");

// @desc    Add experience
// @route   POST /api/experience
// @access  Private
exports.addExperience = async (req, res) => {
  try {
    const { title, company, type, location, startDate, endDate, currentlyWorking, description, skills } = req.body;

    if (!title || !company || !type || !startDate) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const experience = await Experience.create({
      userId: req.user.id,
      title,
      company,
      type,
      location,
      startDate,
      endDate: currentlyWorking ? null : endDate,
      currentlyWorking,
      description,
      skills: Array.isArray(skills) ? skills : skills?.split(",").map((s) => s.trim()),
    });

    res.status(201).json({
      success: true,
      experience,
      message: "Experience added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to add experience",
    });
  }
};

// @desc    Get user experience
// @route   GET /api/experience/user/:userId
// @access  Public
exports.getUserExperience = async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = require("mongoose");
    
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Convert to ObjectId for consistent querying
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const experience = await Experience.find({ userId: userObjectId }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error("Error fetching user experience:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get my experience
// @route   GET /api/experience/my
// @access  Private
exports.getMyExperience = async (req, res) => {
  try {
    const experience = await Experience.find({ userId: req.user.id }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      experience,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private
exports.updateExperience = async (req, res) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    if (experience.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this experience" });
    }

    if (req.body.skills) {
      req.body.skills = Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(",").map((s) => s.trim());
    }

    experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      experience,
      message: "Experience updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    if (experience.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this experience" });
    }

    await Experience.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
