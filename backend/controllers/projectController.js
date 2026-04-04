const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      githubLink,
      demoLink,
      screenshots,
      documentation,
      visibility,
    } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      techStack: techStack || [],
      githubLink,
      demoLink,
      screenshots: screenshots || [],
      documentation,
      visibility: visibility || "public",
      status: "published",
    });

    const populatedProject = await project.populate("createdBy", "name profilePicture");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all projects (with pagination and trending)
// @route   GET /api/projects?page=1&limit=10&sort=trending
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "latest"; // trending, latest
    const skip = (page - 1) * limit;

    let sortObj = { createdAt: -1 };
    if (sort === "trending") {
      sortObj = { likesCount: -1, views: -1, createdAt: -1 };
    }

    const projects = await Project.find({ status: "published", visibility: "public" })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name profilePicture college")
      .populate("comments");

    const total = await Project.countDocuments({
      status: "published",
      visibility: "public",
    });

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's projects
// @route   GET /api/projects/user/:userId
// @access  Public
exports.getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({
      createdBy: userId,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name profilePicture");

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get trending projects
// @route   GET /api/projects/trending
// @access  Public
exports.getTrendingProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: "published",
      visibility: "public",
    })
      .sort({ likesCount: -1, views: -1 })
      .limit(10)
      .populate("createdBy", "name profilePicture");

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:projectId
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("createdBy", "name profilePicture college")
      .populate("comments");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:projectId
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, techStack, githubLink, demoLink } = req.body;

    let project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this project" });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (techStack) project.techStack = techStack;
    if (githubLink) project.githubLink = githubLink;
    if (demoLink) project.demoLink = demoLink;
    project.updatedAt = new Date();

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:projectId
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this project" });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like/Unlike project
// @route   POST /api/projects/:projectId/like
// @access  Private
exports.toggleProjectLike = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const liked = project.likes.includes(userId);

    if (liked) {
      project.likes = project.likes.filter((id) => id.toString() !== userId);
      project.likesCount = Math.max(0, project.likesCount - 1);
    } else {
      project.likes.push(userId);
      project.likesCount += 1;
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: liked ? "Like removed" : "Project liked",
      liked: !liked,
      likesCount: project.likesCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
