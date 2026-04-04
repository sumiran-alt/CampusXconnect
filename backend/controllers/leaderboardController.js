const Leaderboard = require("../models/Leaderboard");
const User = require("../models/User");
const CodingProblem = require("../models/CodingProblem");
const Project = require("../models/Project");

// @desc    Update leaderboard scores
// @route   POST /api/leaderboard/update/:userId
// @access  Private/Admin
exports.updateLeaderboardScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const { scoreType, points } = req.body;

    let leaderboard = await Leaderboard.findOne({ userId });

    if (!leaderboard) {
      leaderboard = new Leaderboard({ userId });
    }

    // Update score breakdown
    if (scoreType === "coding_problem") {
      leaderboard.scoreBreakdown.codingProblems += points;
    } else if (scoreType === "project_posted") {
      leaderboard.scoreBreakdown.projectsPosted += points;
    } else if (scoreType === "project_like") {
      leaderboard.scoreBreakdown.projectLikes += points;
    } else if (scoreType === "connection") {
      leaderboard.scoreBreakdown.connections += points;
    } else if (scoreType === "post") {
      leaderboard.scoreBreakdown.posts += points;
    } else if (scoreType === "post_engagement") {
      leaderboard.scoreBreakdown.postEngagement += points;
    } else if (scoreType === "community") {
      leaderboard.scoreBreakdown.communityParticipation += points;
    } else if (scoreType === "hackathon") {
      leaderboard.scoreBreakdown.hackathonParticipation += points;
    }

    // Recalculate total score
    leaderboard.totalScore = Object.values(leaderboard.scoreBreakdown).reduce(
      (a, b) => a + b,
      0
    );

    leaderboard.lastUpdated = new Date();
    await leaderboard.save();

    res.status(200).json({
      success: true,
      message: "Leaderboard updated",
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get leaderboard rankings
// @route   GET /api/leaderboard?page=1&limit=50
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Get leaderboard and update ranks
    const leaderboards = await Leaderboard.find()
      .sort({ totalScore: -1 })
      .populate("userId", "name profilePicture college email");

    // Update ranks
    let rank = 1;
    for (let lb of leaderboards) {
      lb.rank = rank++;
      await lb.save();
    }

    const paginatedLeaderboards = leaderboards.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      total: leaderboards.length,
      pages: Math.ceil(leaderboards.length / limit),
      currentPage: page,
      leaderboards: paginatedLeaderboards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user ranking
// @route   GET /api/leaderboard/rank/:userId
// @access  Public
exports.getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    const leaderboard = await Leaderboard.findOne({ userId }).populate(
      "userId",
      "name profilePicture college email"
    );

    if (!leaderboard) {
      return res
        .status(404)
        .json({ message: "User not found in leaderboard" });
    }

    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get local leaderboard (same college)
// @route   GET /api/leaderboard/college/:collegeName
// @access  Public
exports.getCollegeLeaderboard = async (req, res) => {
  try {
    const { collegeName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Get users from the same college
    const collegeUsers = await User.find({
      college: collegeName,
    }).select("_id");

    const userIds = collegeUsers.map((u) => u._id);

    const leaderboards = await Leaderboard.find({ userId: { $in: userIds } })
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name profilePicture college email");

    const total = await Leaderboard.countDocuments({ userId: { $in: userIds } });

    res.status(200).json({
      success: true,
      college: collegeName,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      leaderboards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get leaderboard statistics
// @route   GET /api/leaderboard/stats/global
// @access  Public
exports.getLeaderboardStats = async (req, res) => {
  try {
    const topPerformers = await Leaderboard.find()
      .sort({ totalScore: -1 })
      .limit(5)
      .populate("userId", "name profilePicture");

    const avgScore = await Leaderboard.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$totalScore" },
          maxScore: { $max: "$totalScore" },
          minScore: { $min: "$totalScore" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      topPerformers,
      statistics: avgScore[0] || {
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
