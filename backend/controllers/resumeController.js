const Resume = require("../models/Resume");
const User = require("../models/User");

// @desc    Create/Get resume
// @route   GET /api/resume or POST /api/resume
// @access  Private
exports.getOrCreateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      resume = await Resume.create({
        userId: req.user.id,
        personalInfo: {
          name: req.user.name,
          email: req.user.email,
          profileUrl: req.user.profilePicture,
        },
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update personal info
// @route   PUT /api/resume/personal
// @access  Private
exports.updatePersonalInfo = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      resume = new Resume({
        userId: req.user.id,
        personalInfo: req.body,
      });
    } else {
      resume.personalInfo = { ...resume.personalInfo, ...req.body };
    }

    resume.updatedAt = new Date();
    await resume.save();

    res.status(200).json({
      success: true,
      message: "Personal info updated",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add education
// @route   POST /api/resume/education
// @access  Private
exports.addEducation = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      resume = new Resume({ userId: req.user.id });
    }

    resume.education.push(req.body);
    resume.updatedAt = new Date();
    await resume.save();

    res.status(201).json({
      success: true,
      message: "Education added",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add experience
// @route   POST /api/resume/experience
// @access  Private
exports.addExperience = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      resume = new Resume({ userId: req.user.id });
    }

    resume.experience.push(req.body);
    resume.updatedAt = new Date();
    await resume.save();

    res.status(201).json({
      success: true,
      message: "Experience added",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add project to resume
// @route   POST /api/resume/project
// @access  Private
exports.addProject = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      resume = new Resume({ userId: req.user.id });
    }

    resume.projects.push(req.body);
    resume.updatedAt = new Date();
    await resume.save();

    res.status(201).json({
      success: true,
      message: "Project added",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add skills
// @route   POST /api/resume/skills
// @access  Private
exports.addSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      resume = new Resume({ userId: req.user.id, skills });
    } else {
      resume.skills = [...resume.skills, ...skills];
    }

    resume.updatedAt = new Date();
    await resume.save();

    res.status(201).json({
      success: true,
      message: "Skills added",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add certification
// @route   POST /api/resume/certification
// @access  Private
exports.addCertification = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      resume = new Resume({ userId: req.user.id });
    }

    resume.certifications.push(req.body);
    resume.updatedAt = new Date();
    await resume.save();

    res.status(201).json({
      success: true,
      message: "Certification added",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get AI suggestions
// @route   POST /api/resume/ai-suggestions
// @access  Private
exports.getAISuggestions = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Placeholder AI suggestions (integrate OpenAI API here)
    const suggestions = [
      "Add metrics and achievements to your work experience",
      "Include 3-5 more technical skills",
      "Expand your project descriptions with technologies used",
      "Add quantifiable results to your accomplishments",
    ];

    const improvementAreas = ["Skills", "Experience Details", "Achievements"];

    resume.resumeAI.suggestions = suggestions;
    resume.resumeAI.improvementAreas = improvementAreas;
    resume.resumeAI.lastAnalyzedAt = new Date();

    await resume.save();

    res.status(200).json({
      success: true,
      suggestions,
      improvementAreas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Generate PDF resume
// @route   POST /api/resume/export-pdf
// @access  Private
exports.exportPDF = async (req, res) => {
  try {
    const { template } = req.body;

    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Placeholder URL (integrate with PDF generation service like pdfkit or puppeteer)
    const pdfUrl = `https://campusxconnect.com/resume/${req.user.id}.pdf`;

    resume.templates.currentTemplate = template || "modern";
    resume.exports.pdfUrl = pdfUrl;
    resume.exports.lastGeneratedAt = new Date();

    await resume.save();

    res.status(200).json({
      success: true,
      message: "PDF generated successfully",
      pdfUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get public resume
// @route   GET /api/resume/public/:userId
// @access  Public
exports.getPublicResume = async (req, res) => {
  try {
    const { userId } = req.params;

    const resume = await Resume.findOne({
      userId,
      isPublic: true,
    }).populate("userId", "name profilePicture email");

    if (!resume) {
      return res.status(404).json({ message: "Public resume not found" });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle resume visibility
// @route   PUT /api/resume/visibility
// @access  Private
exports.toggleResumeVisibility = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.isPublic = !resume.isPublic;

    if (resume.isPublic) {
      // Generate share link
      resume.shareLink = `https://campusxconnect.com/resume/${req.user.id}`;
    }

    await resume.save();

    res.status(200).json({
      success: true,
      message: `Resume is now ${resume.isPublic ? "public" : "private"}`,
      isPublic: resume.isPublic,
      shareLink: resume.shareLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
