const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  collegeName: {
    type: String,
    required: true,
  },
  collegeEmail: {
    type: String,
    required: true,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  tokenExpiry: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  rejectedAt: {
    type: Date,
    default: null,
  },
  adminNotes: {
    type: String,
    default: null,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Valid college email domains (expandable)
const ALLOWED_DOMAINS = [
  "dgi.edu.in",
  "dronacharya.ac.in",
  "gmail.com", // For testing
];

verificationSchema.statics.isValidCollegeDomain = function (email) {
  const domain = email.split("@")[1];
  return ALLOWED_DOMAINS.includes(domain);
};

module.exports = mongoose.model("Verification", verificationSchema);
