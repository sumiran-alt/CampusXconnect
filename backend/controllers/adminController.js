const User = require("../models/User");
const Post = require("../models/Post");
const CodingProblem = require("../models/CodingProblem");
const Submission = require("../models/Submission");
const Comment = require("../models/Comment");

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/status
// @access  Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== POST MANAGEMENT ====================

// @desc    Get all posts
// @route   GET /api/admin/posts
// @access  Admin
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email").lean();
    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/admin/posts/:id
// @access  Admin
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Flag/Unflag post
// @route   PUT /api/admin/posts/:id/flag
// @access  Admin
exports.togglePostFlag = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.isFlagged = !post.isFlagged;
    await post.save();

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== CODING PROBLEM MANAGEMENT ====================

// @desc    Get all coding problems
// @route   GET /api/admin/problems
// @access  Admin
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await CodingProblem.find().lean();
    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create coding problem
// @route   POST /api/admin/problems
// @access  Admin
exports.createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    const problem = await CodingProblem.create({
      title,
      description,
      difficulty,
      testCases,
    });

    res.status(201).json({ success: true, problem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update coding problem
// @route   PUT /api/admin/problems/:id
// @access  Admin
exports.updateProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ success: true, problem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete coding problem
// @route   DELETE /api/admin/problems/:id
// @access  Admin
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ success: true, message: "Problem deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== SUBMISSION MANAGEMENT ====================

// @desc    Get all submissions
// @route   GET /api/admin/submissions
// @access  Admin
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("userId", "name email")
      .populate("problemId", "title")
      .lean();
    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== STATISTICS ====================

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalPosts = await Post.countDocuments();
    const totalProblems = await CodingProblem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const totalComments = await Comment.countDocuments();

    const stats = {
      totalUsers,
      totalAdmins,
      totalPosts,
      totalProblems,
      totalSubmissions,
      totalComments,
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== COMMENT MANAGEMENT ====================

// @desc    Get all comments
// @route   GET /api/admin/comments
// @access  Admin
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("userId", "name")
      .populate("postId", "title")
      .lean();
    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/admin/comments/:id
// @access  Admin
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
