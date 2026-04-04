const StartupIdea = require("../models/StartupIdea");

// @desc    Create startup idea
// @route   POST /api/ideas
// @access  Private
exports.createIdea = async (req, res) => {
  try {
    const {
      title,
      description,
      problemStatement,
      solution,
      targetMarket,
      businessModel,
      rolesNeeded,
      skillsRequired,
      fundingStatus,
      estimatedBudget,
      category,
    } = req.body;

    if (!title || !description || !problemStatement || !solution) {
      return res.status(400).json({
        message: "Title, description, problem statement and solution are required",
      });
    }

    const idea = await StartupIdea.create({
      title,
      description,
      problemStatement,
      solution,
      createdBy: req.user.id,
      targetMarket,
      businessModel,
      rolesNeeded: rolesNeeded || [],
      skillsRequired: skillsRequired || [],
      fundingStatus: fundingStatus || "unfunded",
      estimatedBudget: estimatedBudget || 0,
      category: category || "other",
      status: "open",
    });

    const populatedIdea = await idea.populate("createdBy", "name profilePicture");

    res.status(201).json({
      success: true,
      message: "Startup idea created successfully",
      idea: populatedIdea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all ideas
// @route   GET /api/ideas?status=open&sort=latest
// @access  Public
exports.getIdeas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "open";
    const sort = req.query.sort || "latest";
    const skip = (page - 1) * limit;

    let sortObj = { createdAt: -1 };
    if (sort === "trending") {
      sortObj = { interestedCount: -1, createdAt: -1 };
    }

    const ideas = await StartupIdea.find({ status })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name profilePicture college");

    const total = await StartupIdea.countDocuments({ status });

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      ideas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single idea
// @route   GET /api/ideas/:ideaId
// @access  Public
exports.getIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const idea = await StartupIdea.findById(ideaId).populate("createdBy", "name profilePicture email");

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    res.status(200).json({
      success: true,
      idea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Express interest in idea
// @route   POST /api/ideas/:ideaId/interested
// @access  Private
exports.expressInterest = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { appliedRole } = req.body;
    const userId = req.user.id;

    const idea = await StartupIdea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if already interested
    const alreadyInterested = idea.interestedUsers.some(
      (user) => user.userId.toString() === userId
    );

    if (alreadyInterested) {
      return res.status(400).json({ message: "You have already expressed interest" });
    }

    idea.interestedUsers.push({
      userId,
      name: req.user.name,
      email: req.user.email,
      appliedRole: appliedRole || "",
      status: "interested",
    });

    idea.interestedCount += 1;
    await idea.save();

    res.status(200).json({
      success: true,
      message: "Interest expressed successfully",
      interestedCount: idea.interestedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Accept interested user
// @route   PUT /api/ideas/:ideaId/accept/:userId
// @access  Private
exports.acceptInterestedUser = async (req, res) => {
  try {
    const { ideaId, userId } = req.params;

    const idea = await StartupIdea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const interestedUser = idea.interestedUsers.find(
      (u) => u.userId.toString() === userId
    );

    if (!interestedUser) {
      return res.status(404).json({ message: "User not found in interested list" });
    }

    interestedUser.status = "accepted";
    await idea.save();

    res.status(200).json({
      success: true,
      message: "User accepted",
      idea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update idea
// @route   PUT /api/ideas/:ideaId
// @access  Private
exports.updateIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    let idea = await StartupIdea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this idea" });
    }

    Object.assign(idea, req.body);
    idea.updatedAt = new Date();
    await idea.save();

    res.status(200).json({
      success: true,
      message: "Idea updated successfully",
      idea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete idea
// @route   DELETE /api/ideas/:ideaId
// @access  Private
exports.deleteIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const idea = await StartupIdea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await StartupIdea.findByIdAndDelete(ideaId);

    res.status(200).json({
      success: true,
      message: "Idea deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
