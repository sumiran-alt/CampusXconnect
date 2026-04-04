const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coverLetter: {
    type: String,
    maxlength: 2000,
  },
  resume: {
    url: String,
    filename: String,
  },
  portfolio: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["applied", "reviewed", "shortlisted", "rejected", "accepted"],
    default: "applied",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    adminNotes: String,
    candidateNotes: String,
  },
});

jobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
jobApplicationSchema.index({ userId: 1 });
jobApplicationSchema.index({ status: 1 });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
