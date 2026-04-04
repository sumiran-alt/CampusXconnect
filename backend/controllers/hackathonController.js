const Hackathon = require("../models/Hackathon");
const HackathonTeam = require("../models/HackathonTeam");
const HackathonSubmission = require("../models/HackathonSubmission");

// @desc    Create hackathon
// @route   POST /api/hackathons
// @access  Private/Admin
exports.createHackathon = async (req, res) => {
  try {
    const {
      title,
      description,
      organizer,
      banner,
      location,
      startDate,
      endDate,
      registrationDeadline,
      theme,
      prizePool,
      maxTeamSize,
      minTeamSize,
      judgesCriteria,
      tags,
    } = req.body;

    if (!title || !description || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Required fields missing" });
    }

    const hackathon = await Hackathon.create({
      title,
      description,
      createdBy: req.user.id,
      organizer: organizer || req.user.name,
      banner,
      location: location || "Online",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      registrationDeadline: registrationDeadline
        ? new Date(registrationDeadline)
        : new Date(startDate),
      theme,
      prizePool: prizePool || {},
      maxTeamSize: maxTeamSize || 5,
      minTeamSize: minTeamSize || 1,
      judgesCriteria: judgesCriteria || [],
      tags: tags || [],
      status: "upcoming",
    });

    res.status(201).json({
      success: true,
      message: "Hackathon created successfully",
      hackathon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all hackathons
// @route   GET /api/hackathons?status=upcoming&page=1
// @access  Public
exports.getHackathons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filters = {};
    if (status) filters.status = status;

    const hackathons = await Hackathon.find(filters)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name profilePicture")
      .populate("judges", "name profilePicture");

    const total = await Hackathon.countDocuments(filters);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      hackathons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single hackathon
// @route   GET /api/hackathons/:hackathonId
// @access  Public
exports.getHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId)
      .populate("createdBy", "name profilePicture email")
      .populate("judges", "name profilePicture")
      .populate("registeredTeams")
      .populate("submissions");

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.status(200).json({
      success: true,
      hackathon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Register team for hackathon
// @route   POST /api/hackathons/:hackathonId/register-team
// @access  Private
exports.registerTeam = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { teamName, description, techStack, ideaStatement } = req.body;

    if (!teamName) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    // Check if user already has a team
    const existingTeam = await HackathonTeam.findOne({
      hackathonId,
      leader: req.user.id,
    });

    if (existingTeam) {
      return res.status(400).json({ message: "You already have a team in this hackathon" });
    }

    const team = await HackathonTeam.create({
      hackathonId,
      teamName,
      description,
      leader: req.user.id,
      techStack: techStack || [],
      ideaStatement,
      members: [
        {
          userId: req.user.id,
          role: "leader",
        },
      ],
    });

    hackathon.registeredTeams.push(team._id);
    await hackathon.save();

    res.status(201).json({
      success: true,
      message: "Team registered successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Join hackathon team
// @route   POST /api/hackathons/teams/:teamId/join
// @access  Private
exports.joinTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { role } = req.body;

    const team = await HackathonTeam.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if already member
    const isMember = team.members.some((m) => m.userId.toString() === req.user.id);

    if (isMember) {
      return res.status(400).json({ message: "You are already a member of this team" });
    }

    team.members.push({
      userId: req.user.id,
      role: role || "developer",
    });

    team.memberCount = team.members.length;
    await team.save();

    res.status(200).json({
      success: true,
      message: "Joined team successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit hackathon project
// @route   POST /api/hackathons/:hackathonId/submit
// @access  Private
exports.submitProject = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const {
      teamId,
      projectTitle,
      description,
      projectLink,
      githubLink,
      demoLink,
      videoLink,
      documentation,
      screenshots,
    } = req.body;

    if (!teamId || !projectTitle) {
      return res.status(400).json({
        message: "Team ID and project title are required",
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const team = await HackathonTeam.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is team leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Only team leader can submit project",
      });
    }

    const submission = await HackathonSubmission.create({
      hackathonId,
      teamId,
      projectTitle,
      description,
      projectLink,
      githubLink,
      demoLink,
      videoLink,
      documentation,
      screenshots: screenshots || [],
      status: "submitted",
    });

    hackathon.submissions.push(submission._id);
    team.status = "submitted";
    await hackathon.save();
    await team.save();

    res.status(201).json({
      success: true,
      message: "Project submitted successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get hackathon leaderboard
// @route   GET /api/hackathons/:hackathonId/leaderboard
// @access  Public
exports.getHackathonLeaderboard = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    const submissions = await HackathonSubmission.find({
      hackathonId,
      status: "approved",
    })
      .sort({ totalScore: -1 })
      .populate("teamId");

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Score submission (Judge)
// @route   PUT /api/submissions/:submissionId/score
// @access  Private
exports.scoreSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { scores, feedback } = req.body;

    const submission = await HackathonSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Calculate score
    let totalScore = scores.reduce((acc, score) => acc + score.points, 0);

    submission.judgeScores.push({
      judgeId: req.user.id,
      scores,
      feedback,
      submittedAt: new Date(),
    });

    submission.totalScore += totalScore;
    submission.status = "approved";

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Score submitted successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
