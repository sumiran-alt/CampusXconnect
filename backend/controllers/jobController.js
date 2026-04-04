const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");

// @desc    Post job
// @route   POST /api/jobs
// @access  Private
exports.postJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      jobType,
      location,
      salary,
      requirements,
      responsibilities,
      benefits,
      duration,
      applyLink,
      applicationDeadline,
      tags,
    } = req.body;

    if (!title || !company || !description || !jobType || !applyLink || !applicationDeadline) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const job = await Job.create({
      title,
      company,
      description,
      jobType,
      location: location || "Remote",
      salary: salary || {},
      postedBy: req.user.id,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      benefits: benefits || [],
      duration: duration || {},
      applyLink,
      applicationDeadline: new Date(applicationDeadline),
      tags: tags || [],
      status: "open",
    });

    const populatedJob = await job.populate("postedBy", "name company");

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: populatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs?jobType=internship&location=Remote&page=1
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = { status: "open" };

    if (req.query.jobType) filters.jobType = req.query.jobType;
    if (req.query.location) filters.location = new RegExp(req.query.location, "i");
    if (req.query.company) filters.company = new RegExp(req.query.company, "i");

    const jobs = await Job.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name company profilePicture");

    const total = await Job.countDocuments(filters);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:jobId
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndUpdate(
      jobId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("postedBy", "name company email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:jobId
// @access  Private
exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    let job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    Object.assign(job, req.body);
    job.updatedAt = new Date();
    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:jobId
// @access  Private
exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Apply to job
// @route   POST /api/jobs/:jobId/apply
// @access  Private
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resume, portfolio } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const alreadyApplied = await JobApplication.findOne({
      jobId,
      userId: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const application = await JobApplication.create({
      jobId,
      userId: req.user.id,
      coverLetter,
      resume,
      portfolio,
      status: "applied",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my applications
// @route   GET /api/jobs/applications/my
// @access  Private
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.user.id })
      .populate("jobId")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get job applications (for recruiter)
// @route   GET /api/jobs/:jobId/applications
// @access  Private
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const applications = await JobApplication.find({ jobId })
      .populate("userId", "name email profilePicture")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update application status
// @route   PUT /api/jobs/applications/:applicationId
// @access  Private
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminNotes } = req.body;

    const application = await JobApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.jobId);

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    application.status = status;
    if (adminNotes) application.notes.adminNotes = adminNotes;
    application.updatedAt = new Date();

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
