const CodingProblem = require("../models/CodingProblem");
const Submission = require("../models/Submission");
const User = require("../models/User");

// Judge0 API configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "https://api.judge0.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

// Language IDs for Judge0
const LANGUAGE_IDS = {
  JavaScript: 63, // Node.js
  Python: 71, // Python 3
  Java: 62, // Java (OpenJDK 13)
  "C++": 54, // C++ (GCC 9.2)
};

// Status mapping from Judge0
const STATUS_MAP = {
  1: "Accepted",
  2: "Time Limit Exceeded",
  3: "Runtime Error",
  4: "Wrong Answer",
  5: "Compilation Error",
  6: "Internal Error",
};

// @desc    Get all coding problems
// @route   GET /api/coding/problems
// @access  Public
exports.getProblems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const difficulty = req.query.difficulty;
    const search = req.query.search;
    const tags = req.query.tags ? req.query.tags.split(",") : [];

    let filter = {};
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    const problems = await CodingProblem.find(filter)
      .select("-testCases") // Don't send test cases to client
      .sort({ difficulty: 1, createdAt: -1 })
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

// @desc    Get problem by slug
// @route   GET /api/coding/problems/:slug
// @access  Public
exports.getProblemBySlug = async (req, res) => {
  try {
    const problem = await CodingProblem.findOne({
      slug: req.params.slug,
    }).select("-testCases.isHidden"); // Hide hidden test cases

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Get user's solved status if authenticated
    let userSolved = false;
    if (req.user) {
      const submission = await Submission.findOne({
        user: req.user.id,
        problem: problem._id,
        status: "Accepted",
      });
      userSolved = !!submission;
    }

    res.status(200).json({
      success: true,
      problem,
      userSolved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get problem by ID
// @route   GET /api/coding/problems/id/:id
// @access  Public
exports.getProblemById = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id).select(
      "-testCases.isHidden",
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    let userSolved = false;
    if (req.user) {
      const submission = await Submission.findOne({
        user: req.user.id,
        problem: problem._id,
        status: "Accepted",
      });
      userSolved = !!submission;
    }

    res.status(200).json({
      success: true,
      problem,
      userSolved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Run code against test cases
// @route   POST /api/coding/run
// @access  Private
exports.runCode = async (req, res) => {
  try {
    const { problemId, code, language, input } = req.body;

    if (!problemId || !code || !language) {
      return res
        .status(400)
        .json({ message: "Please provide problemId, code and language" });
    }

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Get visible test cases
    const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);

    // If input provided, run against that input
    const testCasesToRun = input ? [{ input, output: null }] : visibleTestCases;

    if (testCasesToRun.length === 0) {
      return res.status(400).json({ message: "No test cases available" });
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    // Execute code using Judge0
    const results = [];

    for (const testCase of testCasesToRun) {
      try {
        const result = await executeCodeOnJudge0(
          code,
          languageId,
          testCase.input,
        );

        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: result.output,
          status: result.status,
          runtime: result.runtime,
          memory: result.memory,
        });
      } catch (execError) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: "",
          status: "Runtime Error",
          runtime: 0,
          memory: 0,
          error: execError.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      results,
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
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res
        .status(400)
        .json({ message: "Please provide problemId, code and language" });
    }

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    // Run against all test cases (including hidden)
    const allTestCases = problem.testCases;

    let allPassed = true;
    let totalRuntime = 0;
    let runtimeError = null;
    let compilationError = null;

    for (const testCase of allTestCases) {
      try {
        const result = await executeCodeOnJudge0(
          code,
          languageId,
          testCase.input,
        );

        totalRuntime += result.runtime || 0;

        if (result.status !== "Accepted") {
          allPassed = false;
          if (result.status === "Compilation Error") {
            compilationError = result.output;
          }
          break;
        }

        // Compare output
        const expected = testCase.output.trim();
        const actual = (result.output || "").trim();

        if (expected !== actual) {
          allPassed = false;
          break;
        }
      } catch (execError) {
        allPassed = false;
        runtimeError = execError.message;
        break;
      }
    }

    const status = allPassed
      ? "Accepted"
      : compilationError
        ? "Compilation Error"
        : runtimeError
          ? "Runtime Error"
          : "Wrong Answer";

    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      status,
      runtime: totalRuntime,
      memory: 0,
    });

    // Update problem submissions
    problem.submissions.push(submission._id);
    await problem.save();

    const populatedSubmission = await Submission.findById(submission._id)
      .populate("user", "name email")
      .populate("problem", "title slug");

    res.status(201).json({
      success: true,
      submission: populatedSubmission,
      allPassed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user submissions
// @route   GET /api/coding/submissions
// @access  Private
exports.getUserSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { user: req.user.id };
    if (req.query.problemId) {
      query.problem = req.query.problemId;
    }

    const submissions = await Submission.find(query)
      .populate("problem", "title slug difficulty")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments(query);

    res.status(200).json({
      success: true,
      submissions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubmissions: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user progress
// @route   GET /api/coding/progress
// @access  Private
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all submissions for the user
    const submissions = await Submission.find({ user: userId });

    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === "Accepted",
    ).length;

    // Get unique solved problems
    const solvedProblemIds = [
      ...new Set(acceptedSubmissions.map((s) => s.problem.toString())),
    ];

    const solvedProblems = await CodingProblem.find({
      _id: { $in: solvedProblemIds },
    }).select("title slug difficulty tags");

    // Calculate acceptance rate
    const acceptanceRate =
      totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
        : 0;

    // Get submissions by problem
    const problemStats = {};
    submissions.forEach((sub) => {
      const pid = sub.problem.toString();
      if (!problemStats[pid]) {
        problemStats[pid] = {
          total: 0,
          accepted: 0,
          bestRuntime: Infinity,
        };
      }
      problemStats[pid].total++;
      if (sub.status === "Accepted") {
        problemStats[pid].accepted++;
        if (sub.runtime < problemStats[pid].bestRuntime) {
          problemStats[pid].bestRuntime = sub.runtime;
        }
      }
    });

    res.status(200).json({
      success: true,
      progress: {
        totalSubmissions,
        acceptedSubmissions,
        solvedProblems: solvedProblems.length,
        solvedProblemDetails: solvedProblems,
        acceptanceRate,
        problemStats,
      },
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
    const limit = parseInt(req.query.limit) || 50;
    const type = req.query.type || "global"; // global, college, department

    const leaderboard = await Submission.aggregate([
      {
        $match: { status: "Accepted" },
      },
      {
        $group: {
          _id: "$user",
          solvedCount: { $addToSet: "$problem" },
          totalSubmissions: { $sum: 1 },
          avgRuntime: { $avg: "$runtime" },
          earliestSubmission: { $min: "$createdAt" },
        },
      },
      {
        $project: {
          solvedCount: { $size: "$solvedCount" },
          totalSubmissions: 1,
          avgRuntime: 1,
          earliestSubmission: 1,
        },
      },
      {
        $sort: { solvedCount: -1, avgRuntime: 1, earliestSubmission: 1 },
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

    // Filter by type if needed
    let filteredLeaderboard = leaderboard;

    if (type === "college" && req.user) {
      const user = await User.findById(req.user.id);
      if (user?.college) {
        filteredLeaderboard = leaderboard.filter(
          (entry) => entry.userInfo?.college === user.college,
        );
      }
    } else if (type === "department" && req.user) {
      const user = await User.findById(req.user.id);
      if (user?.branch) {
        filteredLeaderboard = leaderboard.filter(
          (entry) => entry.userInfo?.branch === user.branch,
        );
      }
    }

    // Add rank
    const rankedLeaderboard = filteredLeaderboard.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));

    res.status(200).json({
      success: true,
      leaderboard: rankedLeaderboard,
      type,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get problem submissions (for problem page)
// @route   GET /api/coding/submissions/problem/:problemId
// @access  Private
exports.getProblemSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.id,
      problem: req.params.problemId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to execute code on Judge0
async function executeCodeOnJudge0(sourceCode, languageId, stdin) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create submission
      const createResponse = await fetch(
        `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(JUDGE0_API_KEY
              ? { Authorization: `Bearer ${JUDGE0_API_KEY}` }
              : {}),
          },
          body: JSON.stringify({
            source_code: Buffer.from(sourceCode).toString("base64"),
            language_id: languageId,
            stdin: Buffer.from(stdin || "").toString("base64"),
            cpu_time_limit: 2,
            memory_limit: 128000,
          }),
        },
      );

      if (!createResponse.ok) {
        throw new Error("Failed to create submission");
      }

      const result = await createResponse.json();

      resolve({
        output: result.stdout
          ? Buffer.from(result.stdout, "base64").toString()
          : "",
        stderr: result.stderr
          ? Buffer.from(result.stderr, "base64").toString()
          : "",
        compile_output: result.compile_output
          ? Buffer.from(result.compile_output, "base64").toString()
          : "",
        status: STATUS_MAP[result.status?.id] || "Unknown",
        runtime: result.time * 1000, // Convert to ms
        memory: result.memory,
      });
    } catch (error) {
      // Fallback: return mock result for development
      resolve({
        output: "",
        stderr: error.message,
        compile_output: "",
        status: "Internal Error",
        runtime: 0,
        memory: 0,
      });
    }
  });
}
