const CodingProblem = require("../models/CodingProblem");
const Submission = require("../models/Submission");

// @desc    Get all coding problems
// @route   GET /api/coding/problems
// @access  Public
exports.getProblems = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const difficulty = req.query.difficulty;

    let filter = {};
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const problems = await CodingProblem.find(filter)
      .sort({ difficulty: 1 })
      .skip(skip)
      .limit(limit);

    const total = await CodingProblem.countDocuments(filter);

    res.status(200).json({
      success: true,
      problems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProblems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get problem by ID
// @route   GET /api/coding/problems/:id
// @access  Public
exports.getProblemById = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id).populate({
      path: "submissions",
      populate: {
        path: "user",
      },
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit solution
// @route   POST /api/coding/submit
// @access  Private
exports.submitSolution = async (req, res) => {
  try {
    const { problemId, code, language, status } = req.body;

    if (!problemId || !code || !language) {
      return res
        .status(400)
        .json({ message: "Please provide problemId, code and language" });
    }

    const problem = await CodingProblem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      status: status || "Accepted",
      runtime: Math.random() * 100,
      memory: Math.random() * 100,
    });

    problem.submissions.push(submission._id);
    await problem.save();

    const populatedSubmission = await Submission.findById(
      submission._id,
    ).populate("user");

    res.status(201).json({
      success: true,
      submission: populatedSubmission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user submissions
// @route   GET /api/coding/submissions/:userId
// @access  Public
exports.getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.params.userId })
      .populate("user")
      .populate("problem")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/coding/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = 50;

    const leaderboard = await Submission.aggregate([
      {
        $match: { status: "Accepted" },
      },
      {
        $group: {
          _id: "$user",
          solvedCount: { $sum: 1 },
          avgRuntime: { $avg: "$runtime" },
        },
      },
      {
        $sort: { solvedCount: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
    ]);

    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
