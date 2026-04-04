const Verification = require("../models/Verification");
const User = require("../models/User");

// Email sender function (placeholder - connect to SendGrid or Nodemailer in production)
const sendVerificationEmail = async (email, data) => {
  // TODO: In production, connect to SendGrid or Nodemailer to send real emails
  console.log(`[VERIFICATION EMAIL] Sending verification email to ${email}`, data);
  return { success: true, messageId: Math.random() };
};

// @desc    Request college verification
// @route   POST /api/verification/request
// @access  Private
exports.requestVerification = async (req, res) => {
  try {
    const { collegeName, collegeEmail } = req.body;
    const userId = req.user.id;

    if (!collegeName || !collegeEmail) {
      return res
        .status(400)
        .json({ message: "Please provide college name and email" });
    }

    // Check if email is from accepted college domain
    if (!Verification.isValidCollegeDomain(collegeEmail)) {
      return res
        .status(400)
        .json({ message: "College email domain not recognized" });
    }

    let verification = await Verification.findOne({ userId });
    if (verification) {
      return res.status(400).json({
        message: "Verification request already exists for this user",
      });
    }

    verification = await Verification.create({
      userId,
      email: req.user.email,
      collegeName,
      collegeEmail,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Verification request sent. Awaiting admin approval.",
      verification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all pending verifications (Admin)
// @route   GET /api/verification/pending
// @access  Private/Admin
exports.getPendingVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find({ status: "pending" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: verifications.length,
      verifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve college verification
// @route   PUT /api/verification/approve/:verificationId
// @access  Private/Admin
exports.approveVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { adminNotes } = req.body;

    const verification = await Verification.findById(verificationId);
    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    verification.status = "verified";
    verification.isVerified = true;
    verification.verifiedAt = new Date();
    verification.verifiedBy = req.user.id;
    if (adminNotes) verification.adminNotes = adminNotes;

    await verification.save();

    // Update user profile
    await User.findByIdAndUpdate(verification.userId, {
      isVerified: true,
      verificationStatus: "verified",
      college: verification.collegeName,
    });

    res.status(200).json({
      success: true,
      message: "Verification approved successfully",
      verification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject college verification
// @route   PUT /api/verification/reject/:verificationId
// @access  Private/Admin
exports.rejectVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { rejectionReason, adminNotes } = req.body;

    if (!rejectionReason) {
      return res
        .status(400)
        .json({ message: "Please provide rejection reason" });
    }

    const verification = await Verification.findById(verificationId);
    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    verification.status = "rejected";
    verification.isVerified = false;
    verification.rejectionReason = rejectionReason;
    verification.rejectedAt = new Date();
    if (adminNotes) verification.adminNotes = adminNotes;

    await verification.save();

    res.status(200).json({
      success: true,
      message: "Verification rejected",
      verification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get verification status
// @route   GET /api/verification/status
// @access  Private
exports.getVerificationStatus = async (req, res) => {
  try {
    const verification = await Verification.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      verification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user verification badge status
// @route   GET /api/verification/user/:userId
// @access  Public
exports.getUserVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "isVerified verificationStatus college"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
      college: user.college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
